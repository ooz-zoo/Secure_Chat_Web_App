# Import Flask class from the flask module
from flask import Flask #, send_from_directory

# Create an instance of the Flask class
app = Flask(__name__)  #,static_folder='../frontend/secure_web_chat/build', static_url_path='/')


#Member API Route
# Define a route for the home page - his route will return a basic response to ensure that Flask is set up correctly.
@app.route('/')
def member():
    return 'Hello Flask' #app.send_static_file('index.html')

# Check if the executed file is the main program
if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)