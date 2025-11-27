from app.database import get_db

class Program:
    def __init__(self, programCode, programName, collegeCode=None):
        self.programCode = programCode
        self.programName = programName
        self.collegeCode = collegeCode

    def serialize(self):
        return {
            'programCode': self.programCode,
            'programName': self.programName,
            'collegeCode': self.collegeCode or "N/A"
        }

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO program (programcode, programname, collegecode) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.programCode, self.programName, self.collegeCode))
        db.commit()
        cursor.close()

    def update(self, originalcode):
        db = get_db()
        cursor = db.cursor()
        sql = "UPDATE program SET programcode = %s, programname = %s, collegecode = %s WHERE programcode = %s"
        cursor.execute(sql, (self.programCode, self.programName, self.collegeCode, originalcode))
        db.commit()
        cursor.close()

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM program WHERE programcode = %s", (self.programCode,))
        db.commit()
        cursor.close()

    def delete_with_student_update(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE student SET programCode = NULL WHERE programCode = %s", (self.programCode,))
        cursor.execute("DELETE FROM program WHERE programcode = %s", (self.programCode,))
        db.commit()
        cursor.close()

    @classmethod
    def get(cls, programCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT programcode, programname, collegecode FROM program WHERE programcode = %s", (programCode,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT programcode, programname, collegecode FROM program ORDER BY programname")
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]

    @classmethod
    def exists(cls, programCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT 1 FROM program WHERE LOWER(programcode) = LOWER(%s)", (programCode,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists

    @classmethod
    def by_college(cls, collegeCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT programcode, programname, collegecode FROM program WHERE collegecode = %s", (collegeCode,))
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]
    
    @classmethod
    def total(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM program")
        total = cursor.fetchone()[0]
        cursor.close()
        return total
