from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # Ensure your database functions are imported
import joblib

router = APIRouter()

# Load the trained model
model_filename = "model.joblib"

try:
    loaded_model = joblib.load(model_filename)
    print(f"Model '{model_filename}' loaded successfully!")
except FileNotFoundError:
    print(f"Error: Model file '{model_filename}' not found. Train and save the model first.")
    exit()

@router.get("/predict")
async def read_user_item(user_input: str):
    result = await get_user(user_input)
    # Predict category
    prediction = loaded_model.predict([user_input])[0]
    probabilities = loaded_model.predict_proba([user_input])[0]  # Get confidence scores

    # Extract confidence score for the predicted class
    confidence_score = max(probabilities)
    if result is None:
       raise HTTPException(status_code=404, detail="User not found")
    return prediction,probabilities

