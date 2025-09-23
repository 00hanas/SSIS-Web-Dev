from app import db

class College(db.Model):
    __tablename__ = 'college'

    collegeCode = db.Column('collegecode', db.String(10), primary_key=True)
    collegeName = db.Column('collegename', db.String(100), nullable=False)

    def serialize(self):
        return {
            'collegeCode': self.collegeCode,
            'collegeName': self.collegeName
        }   
