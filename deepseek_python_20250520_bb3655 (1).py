from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Simulierte Daten für verschiedene Anlageformen
investment_data = {
    "aktien": [
        {"name": "Apple", "symbol": "AAPL", "info": "Technologieunternehmen aus den USA"},
        {"name": "Microsoft", "symbol": "MSFT", "info": "Softwarehersteller"}
    ],
    "etfs": [
        {"name": "MSCI World", "symbol": "IWDA", "info": "Diversifizierter Welt-ETF"},
        {"name": "DAX-ETF", "symbol": "EXS1", "info": "Deutscher Leitindex"}
    ],
    "krypto": [
        {"name": "Bitcoin", "symbol": "BTC", "info": "Erste Kryptowährung"},
        {"name": "Ethereum", "symbol": "ETH", "info": "Smart-Contract-Plattform"}
    ],
    "anleihen": [
        {"name": "Bundesanleihe 10J", "symbol": "DE0001102308", "info": "Deutsche Staatsanleihe"}
    ]
}

@app.route('/api/investments')
def get_investments():
    category = request.args.get('category')
    if category and category in investment_data:
        return jsonify({
            "data": investment_data[category],
            "last_update": datetime.now().isoformat()
        })
    return jsonify({"error": "Ungültige Kategorie"}), 400

@app.route('/api/history/<symbol>')
def get_history(symbol):
    # Simulierte historische Daten
    history = [{
        "date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"),
        "value": round(random.uniform(50, 500), 2)
    } for i in range(30, -1, -1)]
    
    return jsonify({
        "symbol": symbol,
        "history": history
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)