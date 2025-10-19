from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)  


with open("house_price_model.pkl", "rb") as f:
    model = pickle.load(f)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    try:
        features = [
            float(data['LotArea']),
            float(data['YearBuilt']),
            float(data['OverallQual']),
            float(data['OverallCond'])
        ]
    except KeyError as e:
        return jsonify({'error': f'Missing key: {e}'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid input type'}), 400

    prediction = model.predict([features])[0]
    return jsonify({'predicted_price': round(prediction, 2)})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
   
    app.run(host='0.0.0.0', port=5000, debug=True)
