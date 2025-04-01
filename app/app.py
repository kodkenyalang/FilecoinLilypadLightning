import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from api.api import api_blueprint

# Create the Flask app
app = Flask(__name__)
CORS(app)

# Register the API blueprint
app.register_blueprint(api_blueprint)

# Serve static files if needed
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend/dist', path)

@app.route('/')
def index():
    return send_from_directory('../frontend/dist', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)