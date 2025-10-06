
#!/usr/bin/env python3
"""
Siddhi Credit Scoring FastAPI Backend

This backend provides API endpoints for the Siddhi web application
to interact with the SQLite database containing beneficiary data.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import pandas as pd
from typing import Optional, List, Dict, Any
import sqlite3
import os
import pickle
import numpy as np
from pydantic import BaseModel

# Define the path to the SQLite database
DB_FILE_PATH = "siddhi_db.sqlite"
TABLE_NAME = "beneficiaries"

# Define the path to the AI model
MODEL_PATH = r"D:\Datasets\NEW\credit_model.pkl"

# Global variable to store the loaded model
loaded_model = None

def load_ai_model():
    """Load the AI model from pickle file"""
    global loaded_model
    if loaded_model is None:
        try:
            if not os.path.exists(MODEL_PATH):
                print(f"WARNING: Model file not found at {MODEL_PATH}")
                return None
            
            with open(MODEL_PATH, 'rb') as f:
                loaded_model = pickle.load(f)
            print("✅ AI Model loaded successfully!")
            return loaded_model
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return None
    return loaded_model

# Create a connection to the SQLite database
engine = create_engine(f"sqlite:///{DB_FILE_PATH}")

# Helper function to convert numpy types to native Python types
def convert_numpy_types(obj):
    """
    Recursively convert numpy types to native Python types for JSON serialization.
    """
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif hasattr(obj, 'item'):  # numpy scalar
        return obj.item()
    elif hasattr(obj, 'tolist'):  # numpy array
        return obj.tolist()
    else:
        return obj

# Pydantic models for request/response validation
class BeneficiaryFilter(BaseModel):
    grade: Optional[str] = None
    loan_amnt_min: Optional[float] = None
    loan_amnt_max: Optional[float] = None
    credit_score_min: Optional[int] = None
    credit_score_max: Optional[int] = None
    purpose: Optional[str] = None
    home_ownership: Optional[str] = None
    is_defaulted: Optional[int] = None

class LoanApplicationInput(BaseModel):
    """Input model for AI prediction - all required fields"""
    loan_amnt: float
    term: int
    int_rate: float
    installment: float
    grade: str
    sub_grade: str
    emp_length: float
    home_ownership: str
    annual_inc: float
    verification_status: str
    purpose: str
    dti: float
    delinq_2yrs: int
    inq_last_6mths: int
    open_acc: int
    pub_rec: int
    revol_bal: float
    revol_util: float
    total_acc: int
    application_type: str
    initial_fico_score: int
    credit_history_length_years: float
    is_first_time_borrower_flag: int
    month_of_loan: int
    principal_remaining: float
    interest_paid_this_month: float
    financial_state: str
    synthetic_electricity_units: int
    synthetic_mobile_recharge_amt: int
    synthetic_utility_payment_ontime: int
    synthetic_payment_status: int
    consumption_stability_last_6m: float
    missed_payments_last_3m: int
    avg_recharge_amt_last_3m: int
    consumption_trend_last_6m: float
    time_in_stress_or_crisis: int
    months_in_stress_or_crisis_l6m: int

class PredictionResponse(BaseModel):
    """Response model for AI prediction"""
    prediction_probability: float
    assessment: str
    recommendation: str
    top_factors: List[Dict[str, Any]]
    risk_level: str

app = FastAPI(
    title="Siddhi Credit Scoring API",
    description="API for accessing beneficiary loan data and analytics",
    version="1.0.0"
)

# Add CORS middleware - Updated for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Local development
        "http://localhost:3000",  # Alternative local port
        "https://*.vercel.app",   # Vercel deployments
        "https://*.onrender.com", # Render deployments
        "*"  # Allow all for development (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

def check_database():
    """Check if database exists and has data"""
    if not os.path.exists(DB_FILE_PATH):
        raise HTTPException(
            status_code=500, 
            detail=f"Database not found. Please run ingest_data.py first to create the database."
        )
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
            count = cursor.fetchone()[0]
            if count == 0:
                raise HTTPException(
                    status_code=500,
                    detail="Database is empty. Please run ingest_data.py first."
                )
    except sqlite3.OperationalError:
        raise HTTPException(
            status_code=500,
            detail=f"Table '{TABLE_NAME}' not found. Please run ingest_data.py first."
        )

@app.get("/")
def read_root():
    """Root endpoint with API information"""
    check_database()
    return {
        "message": "Siddhi Credit Scoring API",
        "version": "1.0.0",
        "endpoints": [
            "/beneficiaries",
            "/beneficiary/{id}",
            "/kpi_summary",
            "/search_beneficiaries",
            "/filter_beneficiaries",
            "/portfolio_trends",
            "/loan_analytics",
            "/risk_analytics",
            "/columns"
        ]
    }

@app.get("/beneficiaries")
def get_beneficiaries(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=1000, description="Items per page"),
    sort_by: Optional[str] = Query(None, description="Column to sort by"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$", description="Sort order")
):
    """
    Retrieves a paginated list of beneficiaries from the database with sorting support.
    """
    check_database()
    
    try:
        offset = (page - 1) * page_size
        
        # Build the query with optional sorting
        query = f"SELECT * FROM {TABLE_NAME}"
        
        if sort_by:
            # Validate sort column exists (basic SQL injection protection)
            with sqlite3.connect(DB_FILE_PATH) as conn:
                cursor = conn.cursor()
                cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
                columns = [row[1] for row in cursor.fetchall()]
                
                if sort_by not in columns:
                    raise HTTPException(status_code=400, detail=f"Invalid sort column: {sort_by}")
                
                query += f" ORDER BY {sort_by} {sort_order.upper()}"
        
        query += f" LIMIT {page_size} OFFSET {offset}"
        
        df = pd.read_sql(query, engine)
        
        # Get total count for pagination
        count_query = f"SELECT COUNT(*) as total FROM {TABLE_NAME}"
        total_count = pd.read_sql(count_query, engine)['total'][0]
        
        # Convert DataFrame to records and handle numpy types
        data_records = df.to_dict(orient="records")
        data_records = convert_numpy_types(data_records)
        
        return {
            "data": data_records,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": int(total_count),
                "total_pages": (total_count + page_size - 1) // page_size,
                "has_next": (page * page_size) < total_count,
                "has_prev": page > 1
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/beneficiary/{beneficiary_id}")
def get_beneficiary(beneficiary_id: int):
    """
    Retrieves a single beneficiary by their ID with enhanced error handling.
    """
    check_database()
    
    try:
        # Use parameterized query to prevent SQL injection
        query = f"SELECT * FROM {TABLE_NAME} WHERE id = ?"
        
        with sqlite3.connect(DB_FILE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(query, (beneficiary_id,))
            row = cursor.fetchone()
            
            if not row:
                raise HTTPException(status_code=404, detail=f"Beneficiary with ID {beneficiary_id} not found")
            
            # Get column names
            cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
            columns = [column[1] for column in cursor.fetchall()]
            
            # Convert row to dictionary
            beneficiary_data = dict(zip(columns, row))
            
            return beneficiary_data
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/kpi_summary")
def get_kpi_summary():
    """
    Retrieves comprehensive Key Performance Indicators (KPIs) from the database.
    """
    check_database()
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            # Total beneficiaries
            total_beneficiaries = pd.read_sql(f"SELECT COUNT(*) as count FROM {TABLE_NAME}", conn)['count'][0]
            
            # Average credit score
            avg_credit = pd.read_sql(f"SELECT AVG(initial_fico_score) as avg_credit FROM {TABLE_NAME}", conn)['avg_credit'][0]
            
            # Total loan amount
            total_loan_amount = pd.read_sql(f"SELECT SUM(loan_amnt) as total FROM {TABLE_NAME}", conn)['total'][0]
            
            # Average loan amount
            avg_loan_amount = pd.read_sql(f"SELECT AVG(loan_amnt) as avg FROM {TABLE_NAME}", conn)['avg'][0]
            
            # Default rate
            default_count = pd.read_sql(f"SELECT COUNT(*) as count FROM {TABLE_NAME} WHERE is_defaulted = 1", conn)['count'][0]
            default_rate = (default_count / total_beneficiaries * 100) if total_beneficiaries > 0 else 0
            
            # Loan grade distribution
            grade_distribution = pd.read_sql(f"SELECT grade, COUNT(*) as count FROM {TABLE_NAME} GROUP BY grade ORDER BY grade", conn)
            
            # Purpose distribution (top 5)
            purpose_distribution = pd.read_sql(f"SELECT purpose, COUNT(*) as count FROM {TABLE_NAME} GROUP BY purpose ORDER BY count DESC LIMIT 5", conn)
            
            # Home ownership distribution
            home_ownership_dist = pd.read_sql(f"SELECT home_ownership, COUNT(*) as count FROM {TABLE_NAME} GROUP BY home_ownership ORDER BY count DESC", conn)
            
            return {
                "overview": {
                    "total_beneficiaries": int(total_beneficiaries),
                    "total_loan_amount": float(total_loan_amount or 0),
                    "avg_loan_amount": float(avg_loan_amount or 0),
                    "avg_credit_score": float(avg_credit or 0),
                    "default_rate_percent": float(default_rate)
                },
                "distributions": {
                    "grade": convert_numpy_types(grade_distribution.to_dict('records')),
                    "purpose": convert_numpy_types(purpose_distribution.to_dict('records')),
                    "home_ownership": convert_numpy_types(home_ownership_dist.to_dict('records'))
                },
                "risk_metrics": {
                    "total_defaults": int(default_count),
                    "default_rate": float(default_rate)
                }
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating KPIs: {str(e)}")

@app.get("/search_beneficiaries")
def search_beneficiaries(
    query: str = Query(..., description="Search query"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500)
):
    """
    Search beneficiaries by ID, name, or other text fields.
    """
    check_database()
    
    try:
        offset = (page - 1) * page_size
        
        # Search in multiple columns - adjust based on your actual column names
        search_query = f"""
        SELECT * FROM {TABLE_NAME} 
        WHERE CAST(id AS TEXT) LIKE ? 
           OR purpose LIKE ? 
           OR home_ownership LIKE ?
           OR grade LIKE ?
        LIMIT {page_size} OFFSET {offset}
        """
        
        search_term = f"%{query}%"
        df = pd.read_sql(search_query, engine, params=[search_term, search_term, search_term, search_term])
        
        return {
            "query": query,
            "results": convert_numpy_types(df.to_dict(orient="records")),
            "count": len(df)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/filter_beneficiaries")
def filter_beneficiaries(filters: BeneficiaryFilter, page: int = 1, page_size: int = 100):
    """
    Filter beneficiaries based on multiple criteria.
    """
    check_database()
    
    try:
        # Build WHERE clause based on filters
        where_conditions = []
        params = []
        
        if filters.grade:
            where_conditions.append("grade = ?")
            params.append(filters.grade)
        
        if filters.loan_amnt_min is not None:
            where_conditions.append("loan_amnt >= ?")
            params.append(filters.loan_amnt_min)
        
        if filters.loan_amnt_max is not None:
            where_conditions.append("loan_amnt <= ?")
            params.append(filters.loan_amnt_max)
        
        if filters.credit_score_min is not None:
            where_conditions.append("initial_fico_score >= ?")
            params.append(filters.credit_score_min)
        
        if filters.credit_score_max is not None:
            where_conditions.append("initial_fico_score <= ?")
            params.append(filters.credit_score_max)
        
        if filters.purpose:
            where_conditions.append("purpose = ?")
            params.append(filters.purpose)
        
        if filters.home_ownership:
            where_conditions.append("home_ownership = ?")
            params.append(filters.home_ownership)
        
        if filters.is_defaulted is not None:
            where_conditions.append("is_defaulted = ?")
            params.append(filters.is_defaulted)
        
        # Build the query
        query = f"SELECT * FROM {TABLE_NAME}"
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        
        # Add pagination
        offset = (page - 1) * page_size
        query += f" LIMIT {page_size} OFFSET {offset}"
        
        df = pd.read_sql(query, engine, params=params)
        
        # Get total count for filters
        count_query = f"SELECT COUNT(*) as total FROM {TABLE_NAME}"
        if where_conditions:
            count_query += " WHERE " + " AND ".join(where_conditions)
        
        total_count = pd.read_sql(count_query, engine, params=params)['total'][0]
        
        return {
            "data": convert_numpy_types(df.to_dict(orient="records")),
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": int(total_count),
                "total_pages": (total_count + page_size - 1) // page_size
            },
            "filters_applied": filters.dict(exclude_none=True)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/portfolio_trends")
def get_portfolio_trends():
    """
    Get portfolio health trends over time - simulated monthly data based on actual portfolio metrics.
    """
    check_database()
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            # Get base metrics
            base_metrics = pd.read_sql(f"""
                SELECT 
                    AVG(initial_fico_score) as avg_credit_score,
                    AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate,
                    COUNT(*) as total_loans,
                    AVG(loan_amnt) as avg_loan_amount
                FROM {TABLE_NAME}
            """, conn)
            
            # Get grade distribution for health calculation
            grade_health = pd.read_sql(f"""
                SELECT grade, 
                       COUNT(*) as count,
                       AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate
                FROM {TABLE_NAME} 
                GROUP BY grade
                ORDER BY grade
            """, conn)
            
            # Calculate weighted health score (higher is better)
            # Assign weights: A=10, B=8, C=6, D=4, E=2, F=1, G=0.5
            grade_weights = {'A': 10, 'B': 8, 'C': 6, 'D': 4, 'E': 2, 'F': 1, 'G': 0.5}
            total_weighted = sum(row['count'] * grade_weights.get(row['grade'], 5) for _, row in grade_health.iterrows())
            total_count = grade_health['count'].sum()
            base_health_score = (total_weighted / total_count) if total_count > 0 else 6.0
            
            # Generate trend data for the last 6 months
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            trends = []
            
            for i, month in enumerate(months):
                # Add some realistic variation around the base score
                variation = np.random.normal(0, 0.2)  # Small random variation
                trend_factor = 0.05 * i  # Slight upward trend
                health_score = max(1.0, min(10.0, base_health_score + trend_factor + variation))
                
                trends.append({
                    "month": month,
                    "score": round(health_score, 1),
                    "avg_credit": round(base_metrics.iloc[0]['avg_credit_score'] + i * 2, 0),
                    "default_rate": round(max(0, base_metrics.iloc[0]['default_rate'] - i * 0.1), 2)
                })
            
            return {
                "portfolio_health": trends,
                "current_metrics": {
                    "health_score": round(base_health_score, 1),
                    "avg_credit_score": round(base_metrics.iloc[0]['avg_credit_score'], 0),
                    "default_rate": round(base_metrics.iloc[0]['default_rate'], 2),
                    "total_loans": int(base_metrics.iloc[0]['total_loans'])
                }
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/loan_analytics")
def get_loan_analytics():
    """
    Get loan-specific analytics and trends.
    """
    check_database()
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            # Loan amount distribution by grade
            loan_by_grade = pd.read_sql(f"""
                SELECT grade, 
                       COUNT(*) as loan_count,
                       AVG(loan_amnt) as avg_amount,
                       SUM(loan_amnt) as total_amount,
                       MIN(loan_amnt) as min_amount,
                       MAX(loan_amnt) as max_amount
                FROM {TABLE_NAME} 
                GROUP BY grade 
                ORDER BY grade
            """, conn)
            
            # Loan purpose analysis
            purpose_analysis = pd.read_sql(f"""
                SELECT purpose,
                       COUNT(*) as loan_count,
                       AVG(loan_amnt) as avg_amount,
                       AVG(initial_fico_score) as avg_credit,
                       AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate
                FROM {TABLE_NAME}
                GROUP BY purpose
                ORDER BY loan_count DESC
                LIMIT 10
            """, conn)
            
            # Term analysis
            term_analysis = pd.read_sql(f"""
                SELECT term,
                       COUNT(*) as loan_count,
                       AVG(loan_amnt) as avg_amount,
                       AVG(int_rate) as avg_interest_rate
                FROM {TABLE_NAME}
                GROUP BY term
                ORDER BY term
            """, conn)
            
            return {
                "loan_by_grade": convert_numpy_types(loan_by_grade.to_dict('records')),
                "purpose_analysis": convert_numpy_types(purpose_analysis.to_dict('records')),
                "term_analysis": convert_numpy_types(term_analysis.to_dict('records'))
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk_analytics")
def get_risk_analytics():
    """
    Get risk-related analytics and default predictions.
    """
    check_database()
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            # Default rate by grade
            default_by_grade = pd.read_sql(f"""
                SELECT grade,
                       COUNT(*) as total_loans,
                       SUM(is_defaulted) as defaults,
                       AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate,
                       AVG(initial_fico_score) as avg_credit
                FROM {TABLE_NAME}
                GROUP BY grade
                ORDER BY grade
            """, conn)
            
            # Risk by credit score ranges
            credit_risk = pd.read_sql(f"""
                SELECT 
                    CASE 
                        WHEN initial_fico_score < 580 THEN 'Poor (< 580)'
                        WHEN initial_fico_score < 670 THEN 'Fair (580-669)'
                        WHEN initial_fico_score < 740 THEN 'Good (670-739)'
                        WHEN initial_fico_score < 800 THEN 'Very Good (740-799)'
                        ELSE 'Excellent (800+)'
                    END as credit_range,
                    COUNT(*) as loan_count,
                    AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate,
                    AVG(loan_amnt) as avg_loan_amount
                FROM {TABLE_NAME}
                GROUP BY credit_range
                ORDER BY MIN(initial_fico_score)
            """, conn)
            
            # Home ownership risk analysis
            home_ownership_risk = pd.read_sql(f"""
                SELECT home_ownership,
                       COUNT(*) as total_loans,
                       AVG(CAST(is_defaulted AS FLOAT)) * 100 as default_rate,
                       AVG(loan_amnt) as avg_loan_amount,
                       AVG(annual_inc) as avg_income
                FROM {TABLE_NAME}
                GROUP BY home_ownership
                ORDER BY default_rate DESC
            """, conn)
            
            return {
                "default_by_grade": convert_numpy_types(default_by_grade.to_dict('records')),
                "credit_risk_analysis": convert_numpy_types(credit_risk.to_dict('records')),
                "home_ownership_risk": convert_numpy_types(home_ownership_risk.to_dict('records'))
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/columns")
def get_columns():
    """
    Get all available columns in the beneficiaries table.
    """
    check_database()
    
    try:
        with sqlite3.connect(DB_FILE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
            columns_info = cursor.fetchall()
            
            columns = []
            for col_info in columns_info:
                columns.append({
                    "name": col_info[1],
                    "type": col_info[2],
                    "not_null": bool(col_info[3]),
                    "primary_key": bool(col_info[5])
                })
            
            return {
                "table_name": TABLE_NAME,
                "columns": columns,
                "total_columns": len(columns)
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict_loan_default(application: LoanApplicationInput):
    """
    Predict loan default risk using the loaded AI model.
    Returns probability, assessment, and key factors.
    """
    try:
        # Load the model if not already loaded
        model = load_ai_model()
        
        if model is None:
            raise HTTPException(
                status_code=503, 
                detail="AI Model not available. Please check model path configuration."
            )
        
        # Convert input to dictionary (Pydantic V2)
        input_data = application.model_dump()
        
        # Create a DataFrame with the input data (model expects DataFrame)
        df = pd.DataFrame([input_data])
        
        # XGBoost requires categorical variables to be encoded
        # Define categorical columns that need encoding
        categorical_columns = [
            'grade', 'sub_grade', 'home_ownership', 'verification_status',
            'purpose', 'application_type', 'financial_state'
        ]
        
        # Encode categorical variables using LabelEncoder or simple mapping
        from sklearn.preprocessing import LabelEncoder
        
        # Create label encoders and encode the categorical columns
        for col in categorical_columns:
            if col in df.columns:
                le = LabelEncoder()
                # Fit and transform the column
                df[col] = le.fit_transform(df[col].astype(str))
        
        # Make prediction
        # Assuming the model returns probability of default
        try:
            # If model has predict_proba method
            if hasattr(model, 'predict_proba'):
                prediction_proba = model.predict_proba(df)
                # Assuming binary classification: [prob_no_default, prob_default]
                probability_default = float(prediction_proba[0][1])
            else:
                # If only predict method is available
                prediction = model.predict(df)
                probability_default = float(prediction[0])
        except Exception as pred_error:
            # Enhanced error message for debugging
            import traceback
            error_details = {
                "error_type": type(pred_error).__name__,
                "error_message": str(pred_error),
                "traceback": traceback.format_exc(),
                "dataframe_shape": df.shape,
                "dataframe_columns": list(df.columns),
                "model_type": type(model).__name__
            }
            print("PREDICTION ERROR DETAILS:", error_details)
            raise HTTPException(
                status_code=500,
                detail=f"Prediction error: {str(pred_error)}. Check server logs for details."
            )
        
        # Get feature importance for explanation (if available)
        top_factors = []
        try:
            if hasattr(model, 'feature_importances_'):
                feature_names = list(input_data.keys())
                importances = model.feature_importances_
                
                # Get top 5 most important features
                top_indices = np.argsort(importances)[-5:][::-1]
                
                for idx in top_indices:
                    feature_name = feature_names[idx]
                    feature_value = input_data[feature_name]
                    importance = float(importances[idx])
                    
                    top_factors.append({
                        "feature": feature_name,
                        "value": str(feature_value),
                        "importance": importance,
                        "impact": "HIGH" if importance > 0.1 else "MEDIUM" if importance > 0.05 else "LOW"
                    })
        except Exception as importance_error:
            print(f"Could not extract feature importance: {str(importance_error)}")
        
        # Determine assessment
        if probability_default < 0.15:
            assessment = "LOW RISK"
            recommendation = "APPROVE"
            risk_level = "low"
        elif probability_default < 0.40:
            assessment = "MEDIUM RISK"
            recommendation = "MANUAL REVIEW"
            risk_level = "medium"
        else:
            assessment = "HIGH RISK"
            recommendation = "DENY"
            risk_level = "high"
        
        # Format response
        response = {
            "prediction_probability": round(probability_default * 100, 2),  # Convert to percentage
            "assessment": assessment,
            "recommendation": recommendation,
            "top_factors": top_factors,
            "risk_level": risk_level
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify API and database status.
    """
    try:
        check_database()
        
        with sqlite3.connect(DB_FILE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
            row_count = cursor.fetchone()[0]
        
        return {
            "status": "healthy",
            "database_connected": True,
            "total_records": row_count,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": pd.Timestamp.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    print("Starting Siddhi Credit Scoring API server...")
    print("Make sure you have run 'python ingest_data.py' first to create the database!")
    print("\n🤖 Loading AI Model...")
    load_ai_model()
    
    # Use PORT environment variable for Railway, fallback to 8001 for local
    import os
    port = int(os.environ.get("PORT", 8001))
    
    print(f"\nAPI will be available at: http://localhost:{port}")
    print(f"API documentation: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
