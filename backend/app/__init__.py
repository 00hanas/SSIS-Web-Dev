from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.extensions import db, migrate
from app.routes import register_routes
from config import Config
from dotenv import load_dotenv


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    register_routes(app)

    from app.models import student, program, college, user

    return app
