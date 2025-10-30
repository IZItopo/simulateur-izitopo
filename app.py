from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/noise')
def get_noise():
    """Génère du bruit aléatoire pour les précisions RTK"""
    hrms_max = float(request.args.get('hrms_max', 0.030))
    vrrms_max = float(request.args.get('vrrms_max', 0.050))
    
    return jsonify({
        'hrms': round(random.uniform(0.005, hrms_max), 3),
        'vrrms': round(random.uniform(0.010, vrrms_max), 3),
        'satellites': random.randint(27, 31)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
