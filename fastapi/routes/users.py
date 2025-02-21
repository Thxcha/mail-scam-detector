from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # Ensure your database functions are imported
import joblib

router = APIRouter()


# Pydantic model for user creation
class UserCreate(BaseModel):
   username: str
   password_hash: str
   email: str


# Pydantic model for user update
class UserUpdate(BaseModel):
   username: Optional[str]
   password_hash: Optional[str]
   email: Optional[str]


# Pydantic model for user response
class User(BaseModel):
   user_id: int
   username: str
   password_hash: str
   email: str
   created_at: datetime


# Pydantic model for login
class UserLogin(BaseModel):
   email: str
   password_hash: str

# Define the expected request body format
class UserInput(BaseModel):
    user_input: str  # Ensure it's a string

# Load the trained model
MODEL_PATH = "routes/model.joblib"

try:
    loaded_model = joblib.load(MODEL_PATH)
    print(f"Model '{MODEL_PATH}' loaded successfully!")
except FileNotFoundError:
    print(f"Error: Model file '{MODEL_PATH}' not found. Train and save the model first.")
    exit()

@router.post("/users/predict")
async def read_user_item(user_input: UserInput):
    try:
        # Extract input text correctly
        text = user_input.user_input.strip()  # Ensure it's a string

        if not text:
            raise HTTPException(status_code=400, detail="Input text cannot be empty.")

        # Predict category (Ensure the input is passed as a list)
        prediction = loaded_model.predict([text])[0]
        probabilities = loaded_model.predict_proba([text])[0]  # Get confidence scores

        # Extract confidence score for the predicted class
        confidence_score = round(max(probabilities), 2)
        category = "Scam" if prediction == 1 else "Non-Scam"
        
        await insert_text(text,prediction)
        await insert_label(prediction)
        
        return f"predicted_category: {category} (confidence_score: {confidence_score:.2f})"
            

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
 
@router.get("/users/label/{label}")
async def read_text(label: int):
    result = len(await get_text(label))  # This will work now
    if result == 0:
        raise HTTPException(status_code=404, detail="Text not found")
    return result

@router.get("/users/label_date/{label}/{time}")
async def read_date_label(label: int, time: int):
    result = len(await get_label_date(label,time))  # This will work now
    return result

