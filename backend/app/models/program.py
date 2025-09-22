from app import db

class Program(db.Model):
    __tablename__ = 'program'

    programCode = db.Column(db.String(20), primary_key=True)
    programName = db.Column(db.String(100), nullable=False)
    collegeCode = db.Column(db.String(10), db.ForeignKey('college.collegeCode'))

    college = db.relationship('College', backref='programs')

    def serialize(self):
        return {
            'programCode': self.programCode,
            'programName': self.programName,
            'collegeCode': self.collegeCode,
            'collegeName': self.college.collegeName if self.college else None
        }
