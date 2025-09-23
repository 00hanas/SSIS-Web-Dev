from flask import Flask
from app.extensions import db, migrate
from config import Config
from flask_cors import CORS

# Import blueprints
from app.routes.student_routes import student_bp
from app.routes.program_routes import program_bp
from app.routes.college_routes import college_bp
from app.routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    from app import models  

    app.register_blueprint(student_bp, url_prefix="/api/students")
    app.register_blueprint(program_bp, url_prefix="/api/programs")
    app.register_blueprint(college_bp, url_prefix="/api/colleges")
    app.register_blueprint(user_bp, url_prefix="/api/users")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
