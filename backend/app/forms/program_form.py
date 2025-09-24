class ProgramForm:
    def __init__(self, data):
        self.programCode = data.get("programCode", "").strip()
        self.programName = data.get("programName", "").strip()
        self.collegeCode = data.get("collegeCode", "").strip()
        self.errors = []

    def is_valid(self):
        if not self.programCode or not self.programName or not self.collegeCode:
            self.errors.append("Missing required fields.")
        return not self.errors

    def to_dict(self):
        return {
            "programCode": self.programCode,
            "programName": self.programName,
            "collegeCode": self.collegeCode
        }
