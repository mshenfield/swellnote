from flask import Flask, request

from . import db

app = Flask(__name__)

@app.route("/api/message", methods=["GET"])
def get_random_message():
    """Return a random message to play the part of 'message in a bottle'."""
    return db.get_random_message()


@app.route("/api/message", methods=["POST"])
def create_message():
    content = request.form["content"]
    if not 2 <= len(content) <= 1023:
        raise Exception(f"Message must be between 2 and 1023 characters. It was {len(content)} characters.")

    db.create_message(content)

    return "", 201
