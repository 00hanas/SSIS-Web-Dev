class CollegeForm:
    def __init__(self, data):
        self.collegeCode = data.get("collegeCode", "").strip()
        self.collegeName = data.get("collegeName", "").strip()
        self.errors = []

    def is_valid(self):
        if not self.collegeCode or not self.collegeName:
            self.errors.append("Missing required fields.")
        if len(self.collegeCode) > 10:
            self.errors.append("College code must be at most 10 characters.")
        return not self.errors

    def to_dict(self):
        return {
            "collegeCode": self.collegeCode,
            "collegeName": self.collegeName
        }
