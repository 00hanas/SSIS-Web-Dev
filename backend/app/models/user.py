from app.database import get_db
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, userID=None, username=None, email=None, password_hash=None):
        self.userID = userID
        self.username = username
        self.email = email
        self.password_hash = password_hash

    def serialize(self):
        return {
            "userID": self.userID,
            "username": self.username,
            "email": self.email
        }

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def add(self, raw_password):
        """Insert a new user into the database"""
        db = get_db()
        cursor = db.cursor()
        hashed_pw = self.hash_password(raw_password)
        sql = """
            INSERT INTO users (username, email, user_password)
            VALUES (%s, %s, %s)
            RETURNING userID
        """
        cursor.execute(sql, (self.username, self.email, hashed_pw))
        self.userID = cursor.fetchone()[0]
        db.commit()
        cursor.close()
        return self.userID

    @classmethod
    def get_by_email(cls, email):
        """Fetch a user by email"""
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT userID, username, email, user_password FROM users WHERE email = %s", (email,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None

    @classmethod
    def get_by_id(cls, user_id):
        """Fetch a user by ID"""
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT userID, username, email, user_password FROM users WHERE userID = %s", (user_id,))
        row = cursor.fetchone()
        cursor.close()
        return cls(*row) if row else None

    @classmethod
    def exists(cls, email, username=None):
        """Check if a user exists by email or username"""
        db = get_db()
        cursor = db.cursor()
        if username:
            cursor.execute("SELECT 1 FROM users WHERE email = %s OR username = %s", (email, username))
        else:
            cursor.execute("SELECT 1 FROM users WHERE email = %s", (email,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists

    @classmethod
    def all(cls):
        """Fetch all users"""
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT userID, username, email, user_password FROM users ORDER BY username")
        rows = cursor.fetchall()
        cursor.close()
        return [cls(*row) for row in rows]
