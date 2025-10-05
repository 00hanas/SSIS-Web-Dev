import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", "15"))

    CORS_ORIGINS = ["http://127.0.0.1:3000"]

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = False  
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_DOMAIN = "127.0.0.1"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


