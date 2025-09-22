from app import db

class Student(db.Model):
    __tablename__ = 'student'

    studentID = db.Column(db.String(9), primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    yearLevel = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    programCode = db.Column(db.String(20), db.ForeignKey('program.programCode'))

    program = db.relationship('Program', backref='students')


    def serialize(self):
        return {
            'studentID': self.studentID,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'yearLevel': self.yearLevel,
            'gender': self.gender,
            'programCode': self.programCode,
            'programName': self.program.programName if self.program else None,
            'collegeCode': self.program.college.collegeCode if self.program and self.program.college else None,
            'collegeName': self.program.college.collegeName if self.program and self.program.college else None
        }
