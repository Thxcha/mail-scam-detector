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


        return f"predicted_category: {category} (confidence_score: {confidence_score:.2f})"
            

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
 
# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
   # Check if the username already exists
   existing_user = await get_user(user.username)
   if existing_user:
       raise HTTPException(status_code=400, detail="Username already exists")


   result = await insert_user(user.username, user.password_hash, user.email)
   if result is None:
       raise HTTPException(status_code=400, detail="Error creating user")
   return result




# Endpoint to get a user by user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
   result = await get_user(user_id)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   return result


# Endpoint to update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
   result = await update_user(user_id, user.username, user.password_hash, user.email)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   return result


# Endpoint to delete a user
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
   result = await delete_user(user_id)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   return {"detail": "User deleted"}


# Endpoint for user login
@router.post("/users/login")
async def login_user(user: UserLogin):
   # Fetch user from the database
   db_user = await get_user_by_email(user.email,user.password_hash)
  
   if db_user is None:
       raise HTTPException(status_code=404, detail="User not found")


# If login is successful, you can return user info (omit password hash)
   return {
       "user_id": db_user.user_id,
       "username": db_user.username,
       "email": db_user.email,
       "created_at": db_user.created_at
   }

