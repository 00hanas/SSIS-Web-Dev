from app.database import get_db

class College:
    def __init__(self, collegeCode, collegeName):
        self.collegeCode = collegeCode
        self.collegeName = collegeName

    def serialize(self):
        return {
            'collegeCode': self.collegeCode,
            'collegeName': self.collegeName
        }

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO college (collegecode, collegename) VALUES (%s, %s)"
        cursor.execute(sql, (self.collegeCode, self.collegeName))
        db.commit()
        cursor.close()

    @classmethod
    def get(cls, collegeCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT collegecode, collegename FROM college WHERE collegecode = %s", (collegeCode,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None

    @classmethod
    def exists(cls, collegeCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT 1 FROM college WHERE LOWER(collegecode) = LOWER(%s)", (collegeCode,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists

    def update(self, originalcode):
        db = get_db()
        cursor = db.cursor()
        sql = "UPDATE college SET collegecode = %s, collegename = %s WHERE collegecode = %s"
        cursor.execute(sql, (self.collegeCode, self.collegeName, originalcode))
        db.commit()
        cursor.close()

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM college WHERE collegecode = %s", (self.collegeCode,))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT collegecode, collegename FROM college ORDER BY collegename")
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]
