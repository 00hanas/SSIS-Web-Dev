from app.database import get_db

class Student():
    def __init__(self, studentID, firstName, lastName, programCode, yearLevel, gender, photoUrl=None):
        self.studentID = studentID
        self.firstName = firstName
        self.lastName = lastName
        self.programCode = programCode
        self.yearLevel = yearLevel
        self.gender = gender
        self.photoUrl = photoUrl


    def serialize(self):
        return {
            'studentID': self.studentID,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'programCode': self.programCode or "N/A",
            'yearLevel': self.yearLevel,
            'gender': self.gender,
            'photoUrl': self.photoUrl or "/student-icon.jpg"
        }
    
    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO student (studentid, firstname, lastname, programcode, yearlevel, gender, photo_url) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (self.studentID, self.firstName, self.lastName, self.programCode, self.yearLevel, self.gender, self.photoUrl))
        db.commit()
        cursor.close()

    def update(self, originalcode):
        db = get_db()
        cursor = db.cursor()
        sql = "UPDATE student SET studentid = %s, firstname = %s, lastname = %s, programcode = %s, yearlevel = %s, gender = %s, photo_url = %s WHERE studentid = %s"
        cursor.execute(sql, (self.studentID, self.firstName, self.lastName, self.programCode, self.yearLevel, self.gender, self.photoUrl, originalcode))
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
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender, photo_url FROM student WHERE studentid = %s", (studentID,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None
    
    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender, photo_url FROM student ORDER BY lastname")
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
        cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender, photo_url FROM student WHERE programcode = %s ORDER BY lastname", (programCode,))
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

    @classmethod
    def total(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM student")
        total = cursor.fetchone()[0]
        cursor.close()
        return total
    
    @classmethod
    def query(cls, search, search_by, sort_by, sort_order, page, page_size):
        db = get_db()
        cursor = db.cursor()

        sql = "SELECT studentid, firstname, lastname, programcode, yearlevel, gender,  photo_url FROM student"
        params = []

        # Search
        if search:
            like = f"%{search}%"
            if search_by == "studentID":
                sql += " WHERE LOWER(studentid) LIKE %s"
                params.append(like)
            elif search_by == "firstName":
                sql += " WHERE LOWER(firstname) LIKE %s"
                params.append(like)
            elif search_by == "lastName":
                sql += " WHERE LOWER(lastname) LIKE %s"
                params.append(like)
            elif search_by == "yearLevel":
                sql += " WHERE LOWER(CAST(yearlevel as TEXT)) LIKE %s"
                params.append(like)
            elif search_by == "gender":
                sql += " WHERE LOWER(gender) LIKE %s"
                params.append(like)
            elif search_by == "programCode":
                sql += " WHERE LOWER(programcode) LIKE %s"
                params.append(like)
            elif search_by == "all":
                sql += (
                    " WHERE LOWER(studentid) LIKE %s OR LOWER(firstname) LIKE %s OR LOWER(lastname) LIKE %s OR LOWER(CAST(yearlevel as TEXT)) LIKE %s OR LOWER(gender) LIKE %s OR LOWER(programcode) LIKE %s"
                )
                params.extend([like, like, like, like, like, like])

        # Sorting
        sort_map = {
            "studentID": "studentid",
            "firstName": "firstname",
            "lastName": "lastname",
            "yearLevel": "yearlevel",
            "gender": "gender",
            "programCode": "programcode",
        }
        sort_column = sort_map.get(sort_by, "studentid")
        sql += f" ORDER BY {sort_column} {sort_order.upper()}"

        # Pagination
        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cursor.execute(sql, params)
        rows = cursor.fetchall()

        # Count total
        count_sql = "SELECT COUNT(*) FROM student"
        count_params = []
        if search:
            if search_by == "studentID":
                count_sql += " WHERE LOWER(studentid) LIKE %s"
                count_params = [like]
            elif search_by == "firstName":
                count_sql += " WHERE LOWER(firstname) LIKE %s"
                count_params = [like]
            elif search_by == "lastName":
                count_sql += " WHERE LOWER(lastname) LIKE %s"
                count_params = [like]
            elif search_by == "yearLevel":
                count_sql += " WHERE LOWER(CAST(yearlevel as TEXT)) LIKE %s"
                count_params = [like]
            elif search_by == "gender":
                count_sql += " WHERE LOWER(gender) LIKE %s"
                count_params = [like]
            elif search_by == "programCode":
                count_sql += " WHERE LOWER(programcode) LIKE %s"
                count_params = [like]
            elif search_by == "all":
                count_sql += (
                    " WHERE LOWER(studentid) LIKE %s OR LOWER(firstname) LIKE %s OR LOWER(lastname) LIKE %s OR LOWER(CAST(yearlevel as TEXT)) LIKE %s OR LOWER(gender) LIKE %s OR LOWER(programcode) LIKE %s"
                )
                count_params = [like, like, like, like, like, like]

        cursor.execute(count_sql, count_params)
        total = cursor.fetchone()[0]

        cursor.close()
        return [cls(*row) for row in rows], total

