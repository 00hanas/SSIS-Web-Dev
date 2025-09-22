from app import db

class College(db.Model):
    __tablename__ = 'college'

    collegeCode = db.Column(db.String(10), primary_key=True)
    collegeName = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            'collegeCode': self.collegeCode,
            'collegeName': self.collegeName
        }
