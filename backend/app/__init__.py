import os
from flask import Flask, render_template
from flask_cors import CORS
from flask import send_from_directory
from flask_jwt_extended import JWTManager
from app.extensions import db, migrate
from app.routes import register_routes
from dotenv import load_dotenv


def create_app():
    load_dotenv()

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    app = Flask(
        __name__,
        template_folder=os.path.join(BASE_DIR, "templates"),
        static_folder=os.path.join(BASE_DIR, "static"),
        static_url_path="/static"
    )

    app.config.from_object("config.Config")

    CORS(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    register_routes(app)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        templates_dir = os.path.join(BASE_DIR, "templates")
        static_dir = os.path.join(BASE_DIR, "static")

        # Serve actual static files (_next, images)
        static_path = os.path.join(static_dir, path)
        if path != "" and os.path.exists(static_path):
            return send_from_directory(static_dir, path)

        # Serve HTML files from templates
        html_file = os.path.join(templates_dir, f"{path}.html")
        if path != "" and os.path.exists(html_file):
            return render_template(f"{path}.html")

        # Otherwise return index.html
        return render_template("index.html")


    return app

