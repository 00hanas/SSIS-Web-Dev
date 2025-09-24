class CollegeForm:
    def __init__(self, data):
        self.collegeCode = data.get("collegeCode", "").strip()
        self.collegeName = data.get("collegeName", "").strip()
        self.errors = []

    def is_valid(self):
        if not self.collegeCode or not self.collegeName:
            self.errors.append("Missing required fields.")
        return not self.errors

    def to_dict(self):
        return {
            "collegeCode": self.collegeCode,
            "collegeName": self.collegeName
        }
