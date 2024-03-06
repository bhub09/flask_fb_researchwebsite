from flask import Flask, render_template, url_for, request, jsonify
from datetime import datetime
import pyrebase

app = Flask(__name__)
config = {}
key = 0

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/authors")
def authors():
    return render_template("authors.html")

@app.route("/procedure")
def procedure():
    return render_template("procedure.html")

@app.route("/results")
def results():
    return render_template("results.html")

if __name__ == "__main__":
    app.run(debug=False, host='172.20.10.2', port=5000)
