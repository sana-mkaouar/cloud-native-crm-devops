from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response

import models
import schemas
import crud
from database import engine, get_db

# Créer les tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Service")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Customer Service API", "version": "1.0"}

# Créer un client
@app.post("/customers/", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = crud.get_customer_by_email(db, email=customer.email)
    if db_customer:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_customer(db=db, customer=customer)

# Lister tous les clients
@app.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = crud.get_customers(db, skip=skip, limit=limit)
    return customers

# Obtenir un client par ID
@app.get("/customers/{customer_id}", response_model=schemas.Customer)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    db_customer = crud.get_customer(db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

# Modifier un client
@app.put("/customers/{customer_id}", response_model=schemas.Customer)
def update_customer(
    customer_id: int,
    customer: schemas.CustomerUpdate,
    db: Session = Depends(get_db)
):
    db_customer = crud.update_customer(db, customer_id=customer_id, customer=customer)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

# Supprimer un client
@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    success = crud.delete_customer(db, customer_id=customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# Rechercher des clients
@app.get("/customers/search/{query}", response_model=List[schemas.Customer])
def search_customers(query: str, db: Session = Depends(get_db)):
    return crud.search_customers(db, query=query)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

REQUESTS = Counter("http_requests_total", "Total HTTP Requests", ["service"])

@app.middleware("http")
async def count_requests(request, call_next):
    REQUESTS.labels("auth-service").inc()
    return await call_next(request)

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Dans customer-service
@app.get("/test-dapr")
async def test_dapr():
    import httpx
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:3500/v1.0/invoke/auth-service/method/")
        return {"auth_response": response.json()}