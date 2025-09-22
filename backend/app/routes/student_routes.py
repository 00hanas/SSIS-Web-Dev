from flask import Blueprint, jsonify
from app.models.student import Student
from app.extensions import db

student_bp = Blueprint("student_bp", __name__, url_prefix="/api/students")

@student_bp.route('', methods=['GET'])
def get_students():
    students = Student.query.limit(10).all()
    return jsonify([s.to_dict() for s in students])
