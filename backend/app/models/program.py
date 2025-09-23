from app import db

class Program(db.Model):
    __tablename__ = 'program'

    programCode = db.Column('programcode', db.String(10), primary_key=True)
    programName = db.Column('programname', db.String(100), nullable=False)
    collegeCode = db.Column('collegecode', db.String(10), db.ForeignKey('college.collegecode'))

    def serialize(self):
        return {
            'programCode': self.programCode,
            'programName': self.programName,
            'collegeCode': self.collegeCode
        }
