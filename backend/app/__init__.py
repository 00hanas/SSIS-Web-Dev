from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)

    register_routes(app)

    from app.models import student, program, college, user

    return app
