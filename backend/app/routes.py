from app.controllers.student_controller import student_bp
from app.controllers.program_controller import program_bp
from app.controllers.college_controller import college_bp
#from app.controllers.auth_controller import auth_bp  # or user_bp if you prefer

def register_routes(app):
    app.register_blueprint(student_bp, url_prefix="/api/students")
    app.register_blueprint(program_bp, url_prefix="/api/programs")
    app.register_blueprint(college_bp, url_prefix="/api/colleges")
    #app.register_blueprint(auth_bp, url_prefix="/api/users")
