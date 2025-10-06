
#!/usr/bin/env python3
"""
One-Time Data Ingestion Script for Siddhi Credit Scoring

This script reads the superdataset_definitive.csv file and converts it
into a SQLite database for fast querying by the web application.

Run this script ONCE to set up your database.
"""

import pandas as pd
from sqlalchemy import create_engine
import sqlite3
import os

# Define the path to the CSV file and the SQLite database
CSV_FILE_PATH = r"D:\Datasets\NEW\superdataset_definitive.csv"
DB_FILE_PATH = "siddhi_db.sqlite"
TABLE_NAME = "beneficiaries"

def validate_csv_file():
    """Check if the CSV file exists and is accessible."""
    if not os.path.exists(CSV_FILE_PATH):
        raise FileNotFoundError(f"CSV file not found at: {CSV_FILE_PATH}")
    
    file_size = os.path.getsize(CSV_FILE_PATH) / (1024 * 1024)  # Size in MB
    print(f"CSV file found: {CSV_FILE_PATH}")
    print(f"File size: {file_size:.2f} MB")
    return True

def load_and_clean_data():
    """Load the CSV file and clean the data."""
    print("Loading CSV data into memory...")
    
    try:
        # Read the CSV file
        df = pd.read_csv(CSV_FILE_PATH)
        print(f"Successfully loaded {len(df)} rows and {len(df.columns)} columns")
        
        # Display basic info about the dataset
        print(f"\nDataset Info:")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns[:10])}...")  # Show first 10 columns
        
        # Clean column names (remove spaces, special characters)
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.replace('-', '_')
        
        # Handle missing values
        print("Handling missing values...")
        
        # Fill numeric columns with 0 or median
        numeric_columns = df.select_dtypes(include=['int64', 'float64']).columns
        for col in numeric_columns:
            if df[col].isnull().sum() > 0:
                df[col] = df[col].fillna(df[col].median())
        
        # Fill string columns with 'Unknown'
        string_columns = df.select_dtypes(include=['object']).columns
        for col in string_columns:
            if df[col].isnull().sum() > 0:
                df[col] = df[col].fillna('Unknown')
        
        print(f"Data cleaned. Final shape: {df.shape}")
        return df
        
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        raise

def ingest_data():
    """
    Reads data from a CSV file, creates a SQLite database, and ingests the data into a table.
    Multiple indexes are created for faster queries.
    """
    print("=" * 60)
    print("Siddhi Credit Scoring - Data Ingestion Script")
    print("=" * 60)
    
    try:
        # Step 1: Validate CSV file
        validate_csv_file()
        
        # Step 2: Load and clean data
        df = load_and_clean_data()
        
        # Step 3: Remove existing database if it exists
        if os.path.exists(DB_FILE_PATH):
            os.remove(DB_FILE_PATH)
            print("Removed existing database file")
        
        # Step 4: Create database connection
        engine = create_engine(f"sqlite:///{DB_FILE_PATH}")
        print(f"Connecting to SQLite database at {DB_FILE_PATH}...")

        # Step 5: Write DataFrame to SQLite database in chunks
        print(f"Writing data to the '{TABLE_NAME}' table in chunks...")
        chunk_size = 50000  # Process in smaller chunks for large datasets
        total_rows = len(df)
        chunks = [df[i:i + chunk_size] for i in range(0, total_rows, chunk_size)]
        
        # Remove existing database first
        engine.dispose()
        
        # Use direct SQLite connection for better performance
        conn = sqlite3.connect(DB_FILE_PATH)
        
        # Write first chunk to create table
        chunks[0].to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
        print(f"Chunk 1/{len(chunks)} written ({len(chunks[0])} rows)")
        
        # Append remaining chunks
        for i, chunk in enumerate(chunks[1:], 2):
            chunk.to_sql(TABLE_NAME, conn, if_exists='append', index=False)
            print(f"Chunk {i}/{len(chunks)} written ({len(chunk)} rows)")
        
        conn.close()
        print("Data written successfully.")

        # Step 6: Create indexes for faster lookups
        with sqlite3.connect(DB_FILE_PATH) as conn:
            cursor = conn.cursor()
            
            print("Creating indexes for faster queries...")
            
            # Primary index on id column
            cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_id ON {TABLE_NAME} (id)")
            
            # Additional useful indexes based on common query patterns
            if 'loan_amnt' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_loan_amnt ON {TABLE_NAME} (loan_amnt)")
            
            if 'grade' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_grade ON {TABLE_NAME} (grade)")
            
            if 'is_defaulted' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_is_defaulted ON {TABLE_NAME} (is_defaulted)")
            
            if 'initial_fico_score' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_credit_score ON {TABLE_NAME} (initial_fico_score)")
            
            if 'purpose' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_purpose ON {TABLE_NAME} (purpose)")
            
            if 'home_ownership' in df.columns:
                cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_home_ownership ON {TABLE_NAME} (home_ownership)")
            
            conn.commit()
            
            # Verify the data was inserted correctly
            cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
            row_count = cursor.fetchone()[0]
            print(f"Successfully inserted {row_count} rows into the database")
            
            # Get column names for verification
            cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
            columns = [row[1] for row in cursor.fetchall()]
            
            print(f"\nDatabase created successfully!")
            print(f"Database file: {os.path.abspath(DB_FILE_PATH)}")
            print(f"Table name: {TABLE_NAME}")
            print(f"Total rows: {row_count}")
            print(f"Total columns: {len(columns)}")
            print("Indexes created successfully.")
            
        print("\n" + "=" * 60)
        print("SUCCESS: Data ingestion completed!")
        print("You can now start your FastAPI server with: python main.py")
        print("=" * 60)

    except FileNotFoundError:
        print(f"Error: The file {CSV_FILE_PATH} was not found.")
        print("Please check the file path and try again.")
    except Exception as e:
        print(f"An error occurred during data ingestion: {e}")
        raise

if __name__ == "__main__":
    ingest_data()
