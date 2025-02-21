from databases import Database
from datetime import date, datetime, timedelta, time as dt_time

today = datetime.today()


POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "mailscam"
POSTGRES_HOST = "db"


DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'


database = Database(DATABASE_URL)


async def connect_db():
   await database.connect()
   print("Database connected")


async def disconnect_db():
   await database.disconnect()
   print("Database disconnected")


# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
   query = """
   INSERT INTO users (username, password_hash, email)
   VALUES (:username, :password_hash, :email)
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to select a user by user_id from the users table
async def get_user(username: str):
   query = "SELECT * FROM users WHERE username = :username"
   return await database.fetch_one(query=query, values={"username": username})


# Function to select a user by email from the users table
async def get_user_by_email(email: str,password_hash:str):
   query = "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
   return await database.fetch_one(query=query, values={"email": email,"password_hash": password_hash})


# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
   query = """
   UPDATE users
   SET username = :username, password_hash = :password_hash, email = :email
   WHERE user_id = :user_id
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to delete a user from the users table
async def delete_user(user_id: int):
   query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
   return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to update a data in data table
async def insert_text(user_text: str, label: int):
    
    query = """
    INSERT INTO items (text_, label_)
    VALUES (:user_text, :label)
    RETURNING text_ AS user_text, label_
    """
    
    values = {"user_text": user_text, "label": label}
    return await database.fetch_one(query=query, values=values)
 
async def insert_label(label: int):
    
    query = """
    INSERT INTO labels_times (label_)
    VALUES (:label)
    RETURNING label_,created_at
    """
    
    values = {"label": label}
    return await database.fetch_one(query=query, values=values)
 
# Function to select text by label from the items table
async def get_text(label: int):
    query = "SELECT * FROM items WHERE label_ = :label"
    return await database.fetch_all(query=query, values={"label": label}) 
 
 # Function to select label by label and time from the labels_times table
async def get_label_date(label: int, time: int):
    # Calculate the target date based on 'time' days ago
    ntime = timedelta(days=time)
    today = datetime.now()
    target_date = today - ntime
    start_datetime = datetime.combine(target_date.date(), dt_time.min)  # 00:00:00
    end_datetime = datetime.combine(target_date.date(), dt_time.max)
    
    # SQL query with matching placeholder names
    query = """
        SELECT label_
        FROM labels_times
        WHERE label_ = :label 
         AND created_at BETWEEN :start_datetime AND :end_datetime
    """
    # Execute the query with the correct parameters
    return await database.fetch_all(
        query=query,
        values={"label": label, "start_datetime": start_datetime, "end_datetime": end_datetime}
    )

