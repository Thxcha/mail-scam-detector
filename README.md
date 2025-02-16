# Next.js + FastAPI + PostgreSQL Starter Project


## Getting Started

### Installation


Build and start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```
Set database using query:

   ```
   CREATE TABLE items (
      text_ TEXT NOT NULL,
      label_ INT NOT NULL
   );
   ```
Open your browser and navigate to:

   ```
   http://localhost:3000
   ```
The FastAPI backend will be available at:

   ```
   http://127.0.0.1:8000/
   ```

### Running the Application

- The **Next.js** application will be available at `http://localhost:3000`.
- The **FastAPI** backend will be accessible at `http://127.0.0.1:8000/`.
- Both services use **hot-reloading** for development, meaning that any changes in your source code will automatically reflect in the application.

### Building the Production Image

To build a production-ready Docker image, run:

```bash
docker-compose build
```



