import os
import json
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString
from io import BytesIO
import zipfile

from translateProcedure import translate_activity

# Funzione per creare l'XML
def create_activity_xml(activity,languages):
    root = Element('node')
    
    # Assicura che l'inglese (ENG) sia sempre presente
    if not any(lang["code"] == "en" for lang in languages):
        languages.insert(0, {"code": "en", "name": "ENG"})  # Aggiunge ENG all'inizio

    # Genera le traduzioni per ogni lingua specificata
    for lang in languages:
        translated_activity = translate_activity(activity, lang["code"])  # Traduci nella lingua specificata
        language_xml(root, translated_activity, lang["name"])  # Aggiungi all'XML con il nome della lingua

    # Convertire l'albero XML in una stringa formattata
    xml_str = parseString(tostring(root, encoding="unicode")).toprettyxml(indent="   ").replace("&quot;","\"")

    return xml_str

def language_xml(root,activity,lang):
    # Lingua italiana
    language = SubElement(root, 'language', value=lang)
    for phrase in activity.node_phrases:
        if phrase['clipId'] == 'Description':
            desc = SubElement(language, 'description', level=phrase['level'])
            desc.text = phrase.get('text', phrase['level'])
        else:
            node_phrase = SubElement(language, 'nodePhrase', clipId=phrase['clipId'], level=phrase['level'])
            node_phrase.text = phrase.get('text', phrase['clipId'])
    details=SubElement(language,'details',level='Novice')
    details.text=activity.details

def retrieveAllActivitiesFromProcedure(data):
    activities = []

    for node in data.get('flow', {}).get('nodes', []):
        #retrieve the single activity
       
        activity = node.get('data', {}).get('activity', None)
        if not activity: 
            continue
        

        #activity contains aslo subProcedure but we are interested only in the name e phrases
        slimActivity= Activity(activity.get('name',""), activity.get('content',{}))
        activities.append(slimActivity)
    
    return activities

def retrieveAllActivities(data):
    activities=[]
    for item in data:
        if "flow" in item and "nodes" in item["flow"]:
            activities.extend(retrieveAllActivitiesFromProcedure(item))
    return activities

class Activity:
    def __init__(self, name, content):
        self.name = name  
        self.node_phrases=content.get('nodePhrases',[])
        self.details=content.get('details',"")
        self.notes=content.get('notes',"")
    
    def printSinglePhrase(self,phrase):
        return f"{phrase['clipId']} {phrase['level']}: {phrase['text']}"

    def __str__(self):
        phrases=""
        for phrase in self.node_phrases:
            phrases +="  "+ self.printSinglePhrase(phrase)+"\n"

        return f"Start\n {self.name}\n NodePhrases:\n{phrases}\n Details: {self.details}\nEND"  # Correct: Returning a string

def zipAllActivitiesXmls(data,languages):
    activities=retrieveAllActivities(data)
    xmls=[]
    for activity in activities:
        xml_content=create_activity_xml(activity,languages)
        #writeXMLFile(output_dir,xml_content,activity.name)
        xmls.append((f"{activity.name}.xml", xml_content))
    # Preparare un archivio ZIP contenente tutti i file XML
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr(f"{data[0].get('title','no-title')}.procedure", json.dumps(data, ensure_ascii=False))
        for filename, xml_content  in xmls:
            zip_file.writestr(filename, xml_content )
    zip_buffer.seek(0)
    return zip_buffer