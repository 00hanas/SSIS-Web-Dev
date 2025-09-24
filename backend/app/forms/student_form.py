class StudentForm:
    def __init__(self, data):
        self.studentID = data.get("studentID", "").strip()
        self.firstName = data.get("firstName", "").strip()
        self.lastName = data.get("lastName", "").strip()
        self.programCode = data.get("programCode", "").strip()
        self.yearLevel = data.get("yearLevel")
        self.gender = data.get("gender", "").strip()
        self.errors = []

    def is_valid(self):
        if not all([self.studentID, self.firstName, self.lastName, self.programCode, self.yearLevel, self.gender]):
            self.errors.append("Missing required fields.")
        elif not isinstance(self.yearLevel, int):
            self.errors.append("Year level must be an integer.")
        elif not self._valid_id_format():
            self.errors.append("Student ID must follow the format XXXX-XXXX.")
        return not self.errors

    def _valid_id_format(self):
        import re
        return re.match(r'^\d{4}-\d{4}$', self.studentID)

    def to_dict(self):
        return {
            "studentID": self.studentID,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "programCode": self.programCode,
            "yearLevel": self.yearLevel,
            "gender": self.gender
        }
