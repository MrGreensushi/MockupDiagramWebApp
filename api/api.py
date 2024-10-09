import time
import parseXml
from flask import Flask,jsonify,request

app = Flask(__name__)
folder_path = r"..\public\xmls\Educational-Contents\BLSDPro"

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/nodes', methods=['GET'])
def get_all_parsed_xml():
    # Walk through the directory and subdirectories to find XML files
    parsed_content=parseXml.parse_all_xmls(folder_path)

    return jsonify(parsed_content)

@app.route('/nodes/<node_id>', methods = ['GET', 'POST', 'DELETE'])
def user(node_id):
    print(node_id)
     #return the information for <node_id>
    if request.method == 'GET':
        # Path to the XML file
        file_path = f"{folder_path}\\{node_id}.xml" 
        # Call the function and print parsed data
        parsed_content = parseXml.parse_defibrillation_xml(file_path)
        return jsonify(parsed_content)
    if request.method == 'POST':
        
        data = request.json # a multidict containing POST data
        parseXml.write_node_to_xml(data,folder_path)
        
        return jsonify({"message": "Data received successfully", "received": data}), 200
        
    if request.method == 'DELETE':
        """delete user with ID <user_id>"""

    
