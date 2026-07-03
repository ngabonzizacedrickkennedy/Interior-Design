import logging

from fastapi import FastAPI

from app.routers import assess, health

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Interior Design AI Service")

app.include_router(health.router)
app.include_router(assess.router)
