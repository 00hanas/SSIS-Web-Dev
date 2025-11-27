class ProgramForm:
    def __init__(self, data):
        self.programCode = data.get("programCode", "").strip()
        self.programName = data.get("programName", "").strip()
        self.collegeCode = data.get("collegeCode", "").strip()
        self.errors = []

    def is_valid(self):
        if not self.programCode or not self.programName or not self.collegeCode:
            self.errors.append("Missing required fields.")
        if len(self.programCode) > 10:
            self.errors.append("Program code must be at most 10 characters.")
        return not self.errors

    def to_dict(self):
        return {
            "programCode": self.programCode,
            "programName": self.programName,
            "collegeCode": self.collegeCode
        }
