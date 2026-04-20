from flask import Flask, render_template, request, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv() # Odpala ladowanie zmiennych z ukrytego .env!

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save", methods=["POST"])
def save_history():
    dane_z_kalkulatora = request.get_json()
    rownanie = dane_z_kalkulatora.get("expression")
    wynik = dane_z_kalkulatora.get("result")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO history (expression, result) VALUES (%s, %s)", (rownanie, wynik))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"status": "success"})
    
@app.route("/history", methods=["GET"])
def get_history():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT expression, result FROM history ORDER BY id DESC LIMIT 5")

    wiersze = cur.fetchall()
    cur.close()
    conn.close()

    historia_pakunek = []
    for wierz in wiersze:
        historia_pakunek.append({
            "expression": wierz[0],
            "result": wierz[1]
        })

    return jsonify(historia_pakunek)

if __name__ == '__main__':
    app.run(debug=True)