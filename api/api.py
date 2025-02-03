import sys
import parseXml
import writeXml
import os
from flask import Flask,jsonify,request,send_file,render_template
from io import BytesIO

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

            zip_folder=writeXml.zipAllActivitiesXmls(data)

            return send_file(zip_folder, as_attachment=True, download_name='xml_files.zip', mimetype='application/zip')
           # return jsonify({"message": "Data received successfully", "received": data,"xmls": xmls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run()