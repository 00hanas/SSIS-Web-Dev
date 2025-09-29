import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BOOTSTRAP_SERVE_LOCAL = os.getenv("BOOTSTRAP_SERVE_LOCAL")
    ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", "15"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # JWT cookie config
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_SAMESITE = "Strict"
    JWT_COOKIE_CSRF_PROTECT = False  # optional for simplicity

