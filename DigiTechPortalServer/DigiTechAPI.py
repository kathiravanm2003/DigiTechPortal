from flask import Flask, render_template, request

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
