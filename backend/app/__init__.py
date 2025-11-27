import os
from flask import Flask, render_template, redirect
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.extensions import db, migrate
from app.routes import register_routes
from config import Config
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

    @app.route("/")
    def root():
        return redirect("/login")

    @app.route("/<path:page>")
    def serve_page(page):

        # Serve static files (images, js, css)
        if "." in page:
            return app.send_static_file(page)

        html_file = f"{page}.html"
        file_path = os.path.join(app.template_folder, html_file)

        if os.path.exists(file_path):
            return render_template(html_file)

        return render_template("404.html"), 404

    return app

