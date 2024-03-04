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
def register():
    return render_template("authors.html")

@app.route("/procedure")
def signIn():
    return render_template("procedure.html")

@app.route("/results")
def home():
    return render_template("results.html")

@app.route("/test", methods=['GET', 'POST'])
def test():

    global config, userID, db, timeStamp, key

    # POST request (FB configuration sent from login.js)
    if request.method == 'POST':

        # Get time stamp to be used as firebase node
        # Each data set will be stored under its own child node identified the timestamp
        timeStamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

        # Receive Firebase configuration credentials, pop uid and assign to userID
        config = request.get_json()     # parse as JSON
        userID = config.pop("userID")   # userID used for updating data in FRD

        # Output to a console (or file) is normally buffered (stored) until it is
        # forced out by the printing of a newline. FLush will force the information
        # in the buffer to be printed immediately.

        print('User ID: ' + userID, flush = True)   # Debug only
        print(config, flush = True)                 # Debug only

        # Initialize firebase connection
        firebase = pyrebase.initialize_app(config)

        # Create database object ("db" represents the root node in the database)
        db = firebase.database()

        # Write sample data to FB to test connection
        db.child('users/' + userID + '/data/' + '/' + timeStamp).update({'testKey':'testValue'})

        return 'Data Uploaded', 200
    else:
        # Code to get data from Arduino will go here
        if(bool(config) == False):
            print("FB config is empty")
        
        else:
            # Take parameters from Arduino request & assign value to variable "value"

            #print(config)
            value = request.args.get("distance")

            print("Distance: " + value, flush = True)

            # Write arduino data to Firebase
            db.child('users/' + userID + '/data/' + '/' + timeStamp).update({key:value})

            # Increment key
            key += 1

        return "Success"

if __name__ == "__main__":
    app.run(debug=False, host='172.20.10.2', port=5000)
