from app import db

class Student(db.Model):
    __tablename__ = 'student'

    studentID = db.Column('studentid', db.String(10), primary_key=True)
    firstName = db.Column('firstname', db.String(50), nullable=False)
    lastName = db.Column('lastname', db.String(50), nullable=False)
    programCode = db.Column('programcode', db.String(10), db.ForeignKey('program.programcode'))
    yearLevel = db.Column('yearlevel', db.Integer, nullable=False)
    gender = db.Column('gender', db.String(10), nullable=False)
    

    def serialize(self):
        return {
            'studentID': self.studentID,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'programCode': self.programCode or "N/A",
            'yearLevel': self.yearLevel,
            'gender': self.gender
        }
