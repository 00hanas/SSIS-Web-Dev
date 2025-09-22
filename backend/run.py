from flask import Flask
from app.extensions import db, migrate
from config import Config
from flask_cors import CORS
from app import create_app
from app.routes.student_routes import student_bp
from app.routes.program_routes import program_bp
from app.routes.college_routes import college_bp
from app.routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS")}})

    # Import models so Alembic detects them
    from app import models  

    app.register_blueprint(student_bp)
    app.register_blueprint(program_bp)
    app.register_blueprint(college_bp)
    app.register_blueprint(user_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)