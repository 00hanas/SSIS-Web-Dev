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
        return not self.errors
