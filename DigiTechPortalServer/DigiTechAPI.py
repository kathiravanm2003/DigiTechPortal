import os
import io
from flask import Flask, render_template, request, Response, send_file
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import threading
import time

app = Flask(__name__)
CORS(app)

def plot_histogram():

    # 2. Data cleaning and pre-processing:
    sales_data = pd.read_csv('./content/sales2.csv')
    # Handling missing values
    sales_data = sales_data.dropna()

    # Dealing with outliers
    sales_data = sales_data[(sales_data['Sales'] > 0) & (sales_data['Sales'] < 5000)]

    # Create a histogram of the sales data
    plt.hist(sales_data['Sales'], bins=20)
    plt.xlabel('Sales')
    plt.ylabel('Frequency')
    plt.title('Distribution of Sales')
    
    bufH = io.BytesIO()
    plt.savefig(bufH, format='png')
    bufH.seek(0)
    plt.clf()
    
    # if os.path.exists(htgFile):
    #     os.remove(htgFile)
    # plt.savefig(htgFile)

    return bufH

def plot_linechart():
    # 2. Data cleaning and pre-processing:
    sales_data = pd.read_csv('./content/sales2.csv')
    # Handling missing values
    sales_data = sales_data.dropna()

    # Dealing with outliers
    sales_data = sales_data[(sales_data['Sales'] > 0) & (sales_data['Sales'] < 5000)]

    # Transforming the data
    sales_data['Date'] = pd.to_datetime(sales_data['Date'])
    sales_data['Year'] = sales_data['Date'].dt.year
    sales_data['Month'] = sales_data['Date'].dt.month

    # Create a line chart of sales by month
    
    sales_by_month = sales_data.groupby('Month')['Sales'].sum()
    
    plt.plot(sales_by_month)
    plt.xlabel('Month')
    plt.ylabel('Sales')
    plt.title('Monthly Sales')
    
    bufL = io.BytesIO()
    plt.savefig(bufL, format='png')
    bufL.seek(0)
    plt.clf()

    return bufL

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

@app.route('/getcleansales')
def getcleansales():
    
    # 2. Data cleaning and pre-processing:
    sales_data = pd.read_csv('./content/sales2.csv')
    # Handling missing values
    sales_data = sales_data.dropna()

    # Dealing with outliers
    sales_data = sales_data[(sales_data['Sales'] > 0) & (sales_data['Sales'] < 5000)]

    return sales_data.to_json(orient='records')

@app.route('/getsaleshistogram')
def getsaleshistogram():
    
    bufH = plot_histogram()
    return Response(bufH.read(), content_type='image/png')

@app.route('/getsaleslinechart')
def getsaleslinechart():
    
    time.sleep(2)
    bufL = plot_linechart()
    return Response(bufL.read(), content_type='image/png')
    

if __name__ == '__main__':
    app.run(debug=True)
