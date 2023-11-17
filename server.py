from flask_app import app
from flask_cors import CORS
from flask_app.controllers import users, languages, flashcards

CORS(app, supports_credentials=True)

if __name__ == "__main__":
    app.run(debug=True)
