from flask import Flask, render_template, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/about')
def about():
    return "This is a sample Flask web application."

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        # Process the form data here...
        return f'Thank you {name} for your message!'
    return render_template('contact.html')

@app.route('/getsales')
def getsales():
    # 1. Loading the data
    
    # Load the data from a CSV file
    sales_data = pd.read_csv('./content/sales2.csv')
    return sales_data.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
