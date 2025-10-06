#!/usr/bin/env python3
"""
Setup and Start Script for Siddhi Credit Scoring

This script helps you set up and start the Siddhi Credit Scoring application.
"""

import os
import subprocess
import sys

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required.")
        sys.exit(1)
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_requirements():
    """Install required Python packages."""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to install requirements")
        sys.exit(1)

def check_database():
    """Check if database exists."""
    if os.path.exists("siddhi_db.sqlite"):
        print("✓ Database found")
        return True
    else:
        print("⚠ Database not found")
        return False

def run_ingestion():
    """Run the data ingestion script."""
    print("Running data ingestion...")
    try:
        subprocess.check_call([sys.executable, "ingest_data.py"])
        print("✓ Data ingestion completed")
    except subprocess.CalledProcessError:
        print("Error: Data ingestion failed")
        return False
    return True

def start_server():
    """Start the FastAPI server."""
    print("Starting FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation will be available at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    
    try:
        subprocess.call([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n✓ Server stopped")

def main():
    """Main setup and start function."""
    print("=" * 60)
    print("Siddhi Credit Scoring - Setup and Start")
    print("=" * 60)
    
    # Check Python version
    check_python_version()
    
    # Install requirements
    install_requirements()
    
    # Check if database exists
    if not check_database():
        print("\nDatabase not found. Running data ingestion...")
        if not run_ingestion():
            print("Setup failed. Please check the error messages above.")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    print("Setup completed successfully!")
    print("=" * 60)
    
    # Ask user if they want to start the server
    response = input("\nDo you want to start the API server now? (y/n): ").lower().strip()
    if response in ['y', 'yes']:
        start_server()
    else:
        print("\nTo start the server later, run: python main.py")
        print("Or run this script again: python setup.py")

if __name__ == "__main__":
    main()