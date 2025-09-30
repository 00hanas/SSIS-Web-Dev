class SignUpForm:
    def __init__(self, data):
        self.username = data.get("username", "").strip()
        self.email = data.get("email", "").strip()
        self.password = data.get("password", "").strip()
        self.errors = []

    def is_valid(self):
        if not self.username:
            self.errors.append("Username is required.")
        if not self.email:
            self.errors.append("Email is required.")
        if not self.password:
            self.errors.append("Password is required.")
        elif len(self.password) < 6:
            self.errors.append("Password must be at least 6 characters.")
        return not self.errors
