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
    
    @classmethod
    def query(cls, search, search_by, sort_by, sort_order, page, page_size):
        db = get_db()
        cursor = db.cursor()

        sql = "SELECT programcode, programname, collegecode FROM program"
        params = []

        if search:
            like = f"%{search}%"
            if search_by == "programCode":
                sql += " WHERE LOWER(programcode) LIKE %s"
                params.append(like)
            elif search_by == "programName":
                sql += " WHERE LOWER(programname) LIKE %s"
                params.append(like)
            elif search_by == "collegeCode":
                sql += " WHERE LOWER(collegecode) LIKE %s"
                params.append(like)
            elif search_by == "all":
                sql += " WHERE LOWER(programcode) LIKE %s OR LOWER(programname) LIKE %s OR LOWER(collegecode) LIKE %s"
                params.extend([like, like, like])

        sort_map = {
            "programCode": "programcode",
            "programName": "programname",
            "collegeCode": "collegecode"
        }
        sort_column = sort_map.get(sort_by, "programcode")
        sql += f" ORDER BY {sort_column} {sort_order.upper()}"

        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cursor.execute(sql, params)
        rows = cursor.fetchall()

        count_sql = "SELECT COUNT(*) FROM program"
        if search:
            if search_by == "programCode":
                count_sql += " WHERE LOWER(programcode) LIKE %s"
                cursor.execute(count_sql, [like])
            elif search_by == "programName":
                count_sql += " WHERE LOWER(programname) LIKE %s"
                cursor.execute(count_sql, [like])
            elif search_by == "collegeCode":
                count_sql += " WHERE LOWER(collegecode) LIKE %s"
                cursor.execute(count_sql, [like])
            elif search_by == "all":
                count_sql += " WHERE LOWER(programcode) LIKE %s OR LOWER(programname) LIKE %s OR LOWER(collegecode) LIKE %s"
                cursor.execute(count_sql, [like, like, like])
        else:
            cursor.execute(count_sql)
        total = cursor.fetchone()[0]

        cursor.close()
        return [cls(*row) for row in rows], total
