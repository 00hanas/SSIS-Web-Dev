import os
from urllib.parse import quote_plus

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # Directly use DATABASE_URL from .env
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BOOTSTRAP_SERVE_LOCAL = os.getenv("BOOTSTRAP_SERVE_LOCAL")
    ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", "15"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")
