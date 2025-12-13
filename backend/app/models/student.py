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
    def query(cls, search, search_by, sort_by, sort_order, page, page_size, program_codes, genders, year_levels):
        db = get_db()
        cursor = db.cursor()

        filters = []
        params = []

        # Filters
        if program_codes:
            placeholders = ','.join(['%s'] * len(program_codes))
            filters.append(f"LOWER(programcode) IN ({placeholders})")
            params.extend(program_codes)

        if genders:
            placeholders = ','.join(['%s'] * len(genders))
            filters.append(f"LOWER(gender) IN ({placeholders})")
            params.extend(genders)

        if year_levels:
            placeholders = ','.join(['%s'] * len(year_levels))
            filters.append(f"CAST(yearlevel AS TEXT) IN ({placeholders})")
            params.extend(year_levels)

        # Search
        like = f"%{search}%" if search else None
        search_filter = ""
        if search:
            if search_by == "studentID":
                search_filter = "LOWER(studentid) LIKE %s"
            elif search_by == "firstName":
                search_filter = "LOWER(firstname) LIKE %s"
            elif search_by == "lastName":
                search_filter = "LOWER(lastname) LIKE %s"
            elif search_by == "yearLevel":
                search_filter = "LOWER(CAST(yearlevel as TEXT)) LIKE %s"
            elif search_by == "gender":
                search_filter = "LOWER(gender) LIKE %s"
            elif search_by == "programCode":
                search_filter = "LOWER(programcode) LIKE %s"
            elif search_by == "all":
                search_filter = (
                    "LOWER(studentid) LIKE %s OR LOWER(firstname) LIKE %s OR LOWER(lastname) LIKE %s OR "
                    "LOWER(CAST(yearlevel as TEXT)) LIKE %s OR LOWER(gender) LIKE %s OR LOWER(programcode) LIKE %s"
                )

        # Combine filters and search
        where_clauses = []
        if filters:
            where_clauses.append(" AND ".join(filters))
        if search and search_filter:
            where_clauses.append(f"({search_filter})")
            if search_by == "all":
                params.extend([like] * 6)
            else:
                params.append(like)
        
        where_sql = f" WHERE {' AND '.join(where_clauses)}" if where_clauses else ""



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
        offset = (page -1) * page_size

        sql = f"""
            SELECT studentid, firstname, lastname, programcode, yearlevel, gender, photo_url 
            FROM student {where_sql} 
            ORDER BY {sort_column} {sort_order.upper()}
            LIMIT %s OFFSET %s
        """

        query_params = params + [page_size, offset]
        cursor.execute(sql, query_params)
        rows = cursor.fetchall()

        # Count query
        count_sql = f"SELECT COUNT(*) FROM student {where_sql}"
        cursor.execute(count_sql, params)
        total = cursor.fetchone()[0]

        cursor.close()
        return [cls(*row) for row in rows], total

