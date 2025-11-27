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

    def delete_with_program_update(self):
        """Detach programs from this college, then delete the college itself."""
        db = get_db()
        cursor = db.cursor()

        cursor.execute("UPDATE program SET collegeCode = NULL WHERE collegeCode = %s", (self.collegeCode,))

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
    
    @classmethod
    def total(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM college")
        total = cursor.fetchone()[0]
        cursor.close()
        return total
    
    @classmethod
    def query(cls, search, search_by, sort_by, sort_order, page, page_size):
        db = get_db()
        cursor = db.cursor()

        # Base query
        sql = "SELECT collegecode, collegename FROM college"
        params = []

        # Search
        if search:
            like = f"%{search}%"
            if search_by == "collegeCode":
                sql += " WHERE LOWER(collegecode) LIKE %s"
                params.append(like)
            elif search_by == "collegeName":
                sql += " WHERE LOWER(collegename) LIKE %s"
                params.append(like)
            elif search_by == "all":
                sql += " WHERE LOWER(collegecode) LIKE %s OR LOWER(collegename) LIKE %s"
                params.extend([like, like])

        # Sorting (map to actual DB column names)
        sort_map = {
            "collegeCode": "collegecode",
            "collegeName": "collegename"
        }
        sort_column = sort_map.get(sort_by, "collegecode")
        sql += f" ORDER BY {sort_column} {sort_order.upper()}"

        # Pagination
        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cursor.execute(sql, params)
        rows = cursor.fetchall()

        # Count total
        count_sql = "SELECT COUNT(*) FROM college"
        if search:
            if search_by == "collegeCode":
                count_sql += " WHERE LOWER(collegecode) LIKE %s"
                cursor.execute(count_sql, [like])
            elif search_by == "collegeName":
                count_sql += " WHERE LOWER(collegename) LIKE %s"
                cursor.execute(count_sql, [like])
            elif search_by == "all":
                count_sql += " WHERE LOWER(collegecode) LIKE %s OR LOWER(collegename) LIKE %s"
                cursor.execute(count_sql, [like, like])
        else:
            cursor.execute(count_sql)
        total = cursor.fetchone()[0]

        cursor.close()
        return [cls(*row) for row in rows], total