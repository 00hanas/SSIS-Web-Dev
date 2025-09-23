from flask import Flask
from app.extensions import db, migrate
from app.routes.student_routes import student_bp
from app.routes.program_routes import program_bp
from app.routes.college_routes import college_bp
from app.routes.user_routes import user_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(student_bp, url_prefix="/api/students")
    app.register_blueprint(program_bp, url_prefix="/api/programs")
    app.register_blueprint(college_bp, url_prefix="/api/colleges")
    app.register_blueprint(user_bp)

    from app.models import student, program, college, user

    return app
