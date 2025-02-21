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

