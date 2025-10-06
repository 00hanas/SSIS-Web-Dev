from app.database import get_db

class Student():
    def __init__(self, studentID, firstName, lastName, programCode, yearLevel, gender):
        self.studentID = studentID
        self.firstName = firstName
        self.lastName = lastName
        self.programCode = programCode
        self.yearLevel = yearLevel
        self.gender = gender


    def serialize(self):
        return {
            'studentID': self.studentID,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'programCode': self.programCode or "N/A",
            'yearLevel': self.yearLevel,
            'gender': self.gender
        }
    
    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO student (studentid, firstname, lastname, programcode, yearlevel, gender) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (self.studentID, self.firstName, self.lastName, self.programCode, self.yearLevel, self.gender))
        db.commit()
        cursor.close()

    def update(self, originalcode):
        db = get_db()
        cursor = db.cursor()
        sql = "UPDATE student SET studentid = %s, firstname = %s, lastname = %s, programcode = %s, yearlevel = %s, gender = %s WHERE studentid = %s"
        cursor.execute(sql, (self.studentID, self.firstName, self.lastName, self.programCode, self.yearLevel, self.gender, originalcode))
        db.commit()
        cursor.close()

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM student WHERE studentid = %s", (self.studentID,))
        db.commit()
        cursor.close()

    @classmethod
    def get(cls, studentID):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender FROM student WHERE studentid = %s", (studentID,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None
    
    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender FROM student ORDER BY lastname")
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]
    
    @classmethod
    def exists(cls, studentID):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT 1 FROM student WHERE LOWER(studentid) = LOWER(%s)", (studentID,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists
    
    @classmethod
    def students_by_prog(cls, programCode):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender FROM student WHERE programcode = %s ORDER BY lastname", (programCode,))
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]

    @classmethod
    def student_count_by_prog(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT programcode, COUNT(*) as student_count
            FROM student
            GROUP BY programcode
            ORDER BY programcode
        """)
        rows = cursor.fetchall()
        cursor.close()
        return rows  
    
    @classmethod
    def gender_count(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT gender, COUNT(*) as student_count
            FROM student
            GROUP BY gender
            ORDER BY gender
        """)
        rows = cursor.fetchall()
        cursor.close()
        return rows

