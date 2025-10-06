<p align="center">
  <img src="Siddhi_Logo.png" alt="Project Siddhi Logo" width="200">
</p>

<h1 align="center">The Siddhi Platform</h1>

<p align="center">
  <strong>An Enterprise-Grade Augmented Intelligence Platform for Concessional Lending Risk Management</strong>
  <br />
</p>

---

## 1. Executive Summary

Project Siddhi is not a credit scoring tool; it is a fully-integrated, enterprise-grade **Augmented Intelligence Platform** for risk management in concessional lending. Its core innovation is a paradigm shift away from static, point-in-time credit assessment. Instead, Siddhi models the dynamic, behavioral "movie" of a borrower's financial life to produce predictions that are more accurate, more transparent, and fundamentally fairer.

The platform is a complete ecosystem, comprising a custom-forged hybrid dataset, a sophisticated AI core, a high-performance backend API, and a professional-grade frontend dashboard. It is designed from the ground up to be **auditable, explainable, and aligned with the social mission** of empowering underserved communities. Siddhi provides loan officers with an AI co-pilot, transforming them from data processors into strategic decision-makers.

---

## 2. The Philosophical Core - From "Photograph" to "Movie"

The foundational problem with traditional credit scoring is its reliance on a static "photograph" of an applicant. Siddhi's core philosophy is that a person's financial health is a story, not a snapshot. We engineered a **longitudinal data structure**, where each loan is represented as a series of monthly "frames." This transforms the dataset into a collection of behavioral movies, allowing our AI to learn from the nuanced patterns of how financial stability (or distress) evolves over time.

---

## 3. The Data Forgery - A High-Fidelity "Superdataset"

The heart of Siddhi is the `superdataset_definitive.csv`, a massive, high-fidelity dataset of over **1.8 million monthly records** engineered specifically for this project. It is built on a real-world foundation and layered with an **intelligent synthetic data generation** process driven by a state-based behavioral simulation. This "bakes in" the exact behavioral clues we want our AI to learn, while intentional noise injection ensures the model is robust for real-world scenarios.

---

## 4. The AI Architecture - A Multi-Tool Approach

Siddhi's intelligence is not a single model but a suite of specialized AI tools.

* **The Core Predictive Engine (XGBoost):** An **XGBoost Classifier** generates the primary risk score, chosen for its unparalleled ability to detect complex, non-linear patterns in tabular data.
* **The Transparency Engine (SHAP):** To fulfill the critical "explainability" constraint, we've integrated **SHAP** (SHapley Additive exPlanations). For every prediction, a SHAP analysis calculates the precise impact of each feature, making the AI's "black box" completely transparent.
* **The Forecasting Engine (LSTM):** An **LSTM network** powers the "Early Warning System," learning from the monthly "movie" of each borrower to recognize temporal patterns that precede financial distress.

---

## 5. The Application & Governance Ecosystem

The AI's intelligence is made accessible through a modern, three-tier application architecture, supported by a robust governance framework.

* **Database (SQLite):** The 1.8 million-row superdataset is ingested into a **SQLite database**, indexed for lightning-fast retrieval.
* **Backend (FastAPI):** A high-performance **Python API** serves as the central nervous system, handling all business logic and orchestrating calls to the AI models.
* **Frontend (React):** A sophisticated **Single Page Application** built with **AG Grid** for high-performance data tables, **Recharts** for visualizations, and **Tailwind CSS** for a clean design.
* **Governance Layer:** A **Tri-Color Triage System** (Green/Yellow/Red), a fully-audited **Human-in-the-Loop Override** system, and a unique **Beneficiary Upliftment Score** ensure the platform is used responsibly and its social impact is measurable.

---

## 6. Demo Video

* [**Watch the Full Project Demo on YouTube**](https://www.youtube.com/watch?v=54RErXbljN8)

---

## 7. Technology Stack

* **Frontend:** **React**, TypeScript, **AG Grid**, **Recharts**, Tailwind CSS
* **Backend:** **FastAPI** (Python), Uvicorn
* **AI / Machine Learning:** **XGBoost**, **SHAP**, Scikit-learn, Pandas, NumPy, LSTM (via TensorFlow/PyTorch)
* **Database:** **SQLite**
* **DevOps & Tooling:** Git, GitHub, VS Code

---

## 8. Getting Started

To get a local copy up and running, follow these steps. As the platform is not publicly hosted, you will need to run both the backend and frontend servers on your local machine.

### Prerequisites
* Python 3.9+
* Node.js v16+
* Git

### Installation
1.  **Download Project Assets:**
    * Download the zipped project assets from Google Drive:
    * [**Download Dataset & AI Models Here**](https://drive.google.com/drive/folders/16MXR4xI9lE8vjjmRi2y4bMo11iFv96GQ?usp=sharing)
    * Unzip the file. You will find a `dataset.csv` file and a `models` folder containing `.pkl` files.

2.  **Clone the Repository:**
    ```sh
    git clone [https://github.com/your-username/siddhi-platform.git](https://github.com/your-username/siddhi-platform.git)
    cd siddhi-platform
    ```

3.  **Backend Setup:**
    * Navigate to the `backend` directory.
    * Place the `models` folder (from Step 1) inside this `backend` directory.
    * Place the `dataset.csv` file inside this `backend` directory.
    * Create and activate a virtual environment:
        ```sh
        python -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        ```
    * Install dependencies:
        ```sh
        pip install -r requirements.txt
        ```
    * Run the server:
        ```sh
        uvicorn main:app --reload
        ```
    * The backend will now be running on `http://127.0.0.1:8000`.

4.  **Frontend Setup:**
    * Navigate to the `frontend` directory in a new terminal window.
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Start the development server:
        ```sh
        npm start
        ```
    * The application will open automatically in your browser at `http://localhost:3000`.

---

## 9. Acknowledgments

This project was inspired by the challenges and opportunities in concessional lending for backward classes and aims to provide a robust, fair, and transparent solution.

Special thanks to the open-source community for the powerful libraries and frameworks that made this project possible, including XGBoost, React, FastAPI, and many more.

---

## 10. Contributors

**Team Siddhi**

This project was developed by a dedicated team of engineers and data scientists:

* Nathwani Darshil
* Aadya Baranwal
* Aditya R Murthy
* Musaddik Jamadar
* Anand Raj
* M Jahnavi Reddy

---

## 11. License






