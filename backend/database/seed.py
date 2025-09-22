import os
import random
from faker import Faker
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

DB_URL = os.getenv("DATABASE_URL") 
print("Connecting to:", DB_URL)

fake = Faker()

# --- Sample Data ---
COLLEGES = [
    ("CCS", "College of Computer Studies"),
    ("CBA", "College of Business Administration"),
    ("COE", "College of Engineering"),
    ("CAS", "College of Arts and Sciences"),
    ("CON", "College of Nursing"),
    ("CED", "College of Education"),
    ("COT", "College of Technology"),
]

PROGRAMS = [
    ("BSCS", "Bachelor of Science in Computer Science", "CCS"),
    ("BSIT", "Bachelor of Science in Information Technology", "CCS"),
    ("BSBA", "Bachelor of Science in Business Administration", "CBA"),
    ("BSA", "Bachelor of Science in Accountancy", "CBA"),
    ("BSEE", "Bachelor of Science in Electrical Engineering", "COE"),
    ("BSME", "Bachelor of Science in Mechanical Engineering", "COE"),
    ("BSCE", "Bachelor of Science in Civil Engineering", "COE"),
    ("BSBIO", "Bachelor of Science in Biology", "CAS"),
    ("BSCHEM", "Bachelor of Science in Chemistry", "CAS"),
    ("BSN", "Bachelor of Science in Nursing", "CON"),
    ("BSED", "Bachelor of Secondary Education", "CED"),
    ("BEED", "Bachelor of Elementary Education", "CED"),
    ("BSECE", "Bachelor of Science in Electronics Engineering", "COE"),
    ("BSARCH", "Bachelor of Science in Architecture", "COE"),
    ("BSTM", "Bachelor of Science in Tourism Management", "CBA"),
    ("BSPsych", "Bachelor of Science in Psychology", "CAS"),
    ("BSPolSci", "Bachelor of Arts in Political Science", "CAS"),
    ("BSPubAd", "Bachelor of Public Administration", "CBA"),
    ("BSCrim", "Bachelor of Science in Criminology", "CAS"),
    ("BSMath", "Bachelor of Science in Mathematics", "CAS"),
    ("BSCpE", "Bachelor of Science in Computer Engineering", "COE"),
    ("BSStat", "Bachelor of Science in Statistics", "CAS"),
    ("BSAgri", "Bachelor of Science in Agriculture", "CAS"),
    ("BSForestry", "Bachelor of Science in Forestry", "CAS"),
    ("BSMarE", "Bachelor of Science in Marine Engineering", "COE"),
    ("BSMarBio", "Bachelor of Science in Marine Biology", "CAS"),
    ("BSPharma", "Bachelor of Science in Pharmacy", "CON"),
    ("BSRadTech", "Bachelor of Science in Radiologic Technology", "CON"),
    ("BSMedTech", "Bachelor of Science in Medical Technology", "CON"),
]

def seed():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Clear existing data
    cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public';
""")
    print("Tables in DB:", [row[0] for row in cur.fetchall()])

    cur.execute('TRUNCATE "student", "program", "college" RESTART IDENTITY CASCADE;')

    # Insert colleges
    for code, name in COLLEGES:
        cur.execute("INSERT INTO college (collegeCode, collegeName) VALUES (%s, %s)", (code, name))

    # Insert programs
    for code, name, college_code in PROGRAMS:
        cur.execute(
            "INSERT INTO program (programCode, programName, collegeCode) VALUES (%s, %s, %s)",
            (code, name, college_code)
        )

    # Insert students
    used_ids = set()

    for _ in range(300):
        while True:
            student_id = f"{random.randint(2018, 2025)}-{random.randint(1000, 9999)}"
            if student_id not in used_ids:
                used_ids.add(student_id)
                break

        year = random.randint(1, 5)
        gender = random.choice(["Male", "Female"])
        program_code = random.choice(PROGRAMS)[0]

        cur.execute(
            "INSERT INTO student (studentID, firstName, lastName, yearLevel, gender, programCode) VALUES (%s, %s, %s, %s, %s, %s)",
            (student_id, fake.first_name(), fake.last_name(), year, gender, program_code)
        )


    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed()
