from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/upload")
def upload():
    return "/upload"

@app.route("/download")
def upload():
    return "/download"