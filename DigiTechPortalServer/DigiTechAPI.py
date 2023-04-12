import os
import io
from flask import Flask, render_template, request, Response, send_file, jsonify, session
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import threading
import time
import numpy as np

app = Flask(__name__)
app.secret_key = 'digitech_secret_key'
CORS(app)

def predict_sales(start_dt, end_dt, fileName) :
    # 6. Sales Prediction

    # Load data from CSV file
    sales_data = pd.read_csv('./uploads/' + fileName)

    # Convert the date column to datetime format
    sales_data['Date'] = pd.to_datetime(sales_data['Date'])

    # Extract the month and year information into separate columns
    sales_data['Month'] = sales_data['Date'].dt.month
    sales_data['Year'] = sales_data['Date'].dt.year


    # Split the data into training and testing sets (80:20 split)
    train = sales_data.sample(frac=0.8, random_state=57)
    test = sales_data.drop(train.index)

    # Create the feature matrix X and target variable y for training
    X_train = train[['Month', 'Year']]
    y_train = train['Sales']

    # Fit a linear regression model to the training data
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Create the feature matrix X and target variable y for testing
    X_test = test[['Month', 'Year']]
    y_test = test['Sales']

    # Predict the sales for the testing set using the trained model
    y_pred = model.predict(X_test)

    # Predict the sales for all months in year 2023 using the trained model
    months_2023 = pd.date_range(start=start_dt, end=end_dt, freq='MS')
    x_2023 = pd.DataFrame({'Month': months_2023.month, 'Year': months_2023.year})
    y_2023 = model.predict(x_2023)

    # Merge the x_2023 and y_2023 dataframes based on their row index
    predictions_2023 = pd.concat([x_2023, pd.DataFrame({'Sales': y_2023})], axis=1)
    predictions_2023['Date'] = pd.to_datetime(predictions_2023[['Year', 'Month']].assign(Day=1))
    predictions_2023 = predictions_2023.drop(['Month','Year'], axis=1)

    # Print the merged dataframe
    # print(predictions_2023)

    # Print the root mean squared error (RMSE) of the predictions
    rmse = np.sqrt(((y_pred - y_test) ** 2).mean())
    # print('RMSE:', rmse)

    # Calculate the R-squared score of the predictions
    r2 = model.score(X_test, y_test)
    # print('R-squared score:', r2)

    # Plot the actual and predicted sales values
    plt.plot(test['Date'], y_test, label='Actual')
    plt.plot(test['Date'], y_pred, label='Predicted (Test Sample)')
    plt.plot(months_2023, y_2023, label='Predicted (Input Range)')
    plt.xlabel('Date')
    plt.ylabel('Sales')
    plt.legend()

    # Adjust the y-axis limits to make y_2023 sales visible
    y_min, y_max = plt.ylim()
    y_2023_max = y_2023.max()
    if y_2023_max > y_max:
        plt.ylim(y_min, y_2023_max*1.1)

    plt.xticks(rotation=35)
    
    bufP = io.BytesIO()
    plt.savefig(bufP, format='png')
    bufP.seek(0)
    plt.clf()

    return bufP

def plot_histogram(fileName):

    # 2. Data cleaning and pre-processing:
    sales_data = pd.read_csv('./uploads/' + fileName)
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

def plot_linechart(fileName):
    # 2. Data cleaning and pre-processing:
    sales_data = pd.read_csv('./uploads/' + fileName)
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
    # return "Hello, DigiTech Portal!"
    return Response("Hello, DigiTech Portal!", content_type='text/plain')

@app.route('/about')
def about():
    return Response("This is a simple Flask web application for Sales Analysis", content_type='text/plain')

@app.route('/getsales')
def getsales():

    # 1. Loading the data    
    # Load the data from a CSV file
    fileName = session.get('fileName')
    sales_data = pd.read_csv("./uploads/" + 'sales2.csv')
    return Response(sales_data.to_json(orient='records'), content_type='application/json')

@app.route('/getcleansales')
def getcleansales():
    
    # 2. Data cleaning and pre-processing:
    fileName = session.get('fileName')
    sales_data = pd.read_csv('./uploads/' + 'sales2.csv')
    # Handling missing values
    sales_data = sales_data.dropna()
    # Dealing with outliers
    sales_data = sales_data[(sales_data['Sales'] > 0) & (sales_data['Sales'] < 5000)]
    return Response(sales_data.to_json(orient='records'), content_type='application/json')

@app.route('/getsaleshistogram')
def getsaleshistogram():
    fileName = session.get('fileName')
    bufH = plot_histogram('sales2.csv')
    return Response(bufH.read(), content_type='image/png')

@app.route('/getsaleslinechart')
def getsaleslinechart():
    
    time.sleep(1)
    fileName = session.get('fileName')
    bufL = plot_linechart('sales2.csv')
    return Response(bufL.read(), content_type='image/png')

@app.route('/getsalesprediction')
def getsalesprediction():
    
    time.sleep(2)
    startdate = request.args.get('startdate')
    enddate = request.args.get('enddate')
    fileName = session.get('fileName')
    bufP = predict_sales(startdate, enddate, 'sales2.csv')
    return Response(bufP.read(), content_type='image/png')

# create a route to handle POST requests
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    # get the file from the request
    file = request.files['file']

    # check if the file is a CSV file
    if file.filename.split('.')[-1] != 'csv':
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    # create a directory called "uploads" if it doesn't exist
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # save the file to the "uploads" directory
    file.save(os.path.join('uploads', file.filename))
    session['fileName'] = file.filename

    # return a success response
    return jsonify({'message': 'File saved successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
