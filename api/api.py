import sys
from translateProcedure import get_language_code_3letters, translate_procedure
import parseXml
import writeXml
import os
from flask import Flask,jsonify,request,send_file,render_template
from io import BytesIO
import json

# Determina il percorso base (supporta modalità PyInstaller)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
if getattr(sys, '_MEIPASS', False):  # Se eseguito come exe
    BASE_DIR = sys._MEIPASS

# Percorso assoluto alla cartella XML
folder_path = os.path.join(BASE_DIR, "xmls", "Educational-Contents", "BLSDPro")
app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "static"), template_folder=os.path.join(BASE_DIR, "templates"))


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/nodes', methods=['GET'])
def get_all_parsed_xml():
    # Walk through the directory and subdirectories to find XML files
    parsed_content=parseXml.parse_all_xmls(folder_path)
    return jsonify(parsed_content)

@app.route('/nodes/<node_id>', methods = ['GET', 'POST', 'DELETE'])
def user(node_id):
    try:
         #return the information for <node_id>
        if request.method == 'GET':
            # Path to the XML file
            file_path = f"{folder_path}\\{node_id}.xml" 
            if not os.path.exists(file_path):
                return jsonify({"error": "File not found"}), 404
            # Call the function and print parsed data
            parsed_content = parseXml.parse_activity_xml(file_path)
            return jsonify(parsed_content)
        if request.method == 'POST':

            data = request.json 
            if not data:
                return jsonify({"error": "No data provided"}), 400

            parseXml.write_node_to_xml(data,folder_path)

            return jsonify({"message": "Data received successfully", "received": data}), 200

        if request.method == 'DELETE':
            return jsonify({"message": f"Node {node_id} deleted"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/procedure',methods=['POST'])
def extract_XML_from_procedure():
    try:
        if request.method == 'POST':
            data = request.json 
            if not data:
                return jsonify({"error": "No data provided"}), 400

            # Estrai jsonProcedure e selectedLanguages dal body
            json_procedure = data.get("jsonProcedure", None)
            selected_languages = data.get("selectedLanguages",[])

            # Verifica che entrambi i campi siano presenti
            if not json_procedure or not isinstance(selected_languages, list):
                return jsonify({"error": "Invalid input data"}), 400
            
            # Se data è una stringa, convertila in un oggetto Python
            if isinstance(json_procedure, str):
                try:
                    json_procedure = json.loads(json_procedure)
                except json.JSONDecodeError:
                    return jsonify({"error": "Errore: il JSON fornito non è valido."+ json_procedure}), 400
           
            # Converti selected_languages in array di oggetti {"code":, "name"}
            selected_languages = [
                get_language_code_3letters(lang_code) for lang_code in selected_languages
            ]

            zip_folder=writeXml.zipAllActivitiesXmls(json_procedure,selected_languages)

            return send_file(zip_folder, as_attachment=True, download_name='xml_files.zip', mimetype='application/zip')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/translateProject/<language_code>',methods=['POST'])
def translate_project(language_code):
    try:
        if request.method == 'POST':
            data = request.json 
            if not data:
                return jsonify({"error": "No data provided"}), 400

            translation=translate_procedure(data,dest_lang=language_code)
            return translation
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
if __name__ == "__main__":
    app.run()