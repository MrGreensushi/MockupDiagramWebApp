import os
import json
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString

# Funzione per creare l'XML
def create_activity_xml(node_phrases):
    root = Element('node')
    # Lingua italiana
    ita = SubElement(root, 'language', value='ITA')
    for phrase in node_phrases:
        if phrase['clipId'] == 'Description':
            desc = SubElement(ita, 'description', level=phrase['level'])
            desc.text = phrase.get('text', phrase['level'])
        else:
            node_phrase = SubElement(ita, 'nodePhrase', clipId=phrase['clipId'], level=phrase['level'])
            node_phrase.text = phrase.get('text', phrase['clipId'])

    # Convertire l'albero XML in una stringa formattata
    xml_str = parseString(tostring(root, encoding="unicode")).toprettyxml(indent="   ").replace("&quot;","\"")

    return xml_str

def retrieveAllActivities(data):
    activities = []

    for node in data.get('flow', {}).get('nodes', []):
        #retrieve the single activity
        activity = node.get('data', {}).get('activity', None)
        if not activity: 
            continue
        
        #activity contains aslo subProcedure but we are interested only in the name e phrases
        slimActivity= Activity(activity.get('name',""), activity.get('nodePhrases',[]))
        activities.append(slimActivity)

        #Retrieve all the activities present in the subProcedure
        subProcedure=activity.get('subProcedure',None)
        if not subProcedure:
            continue

        subProcedureActivities=retrieveAllActivities(subProcedure)
        if not subProcedureActivities:
            continue
        #append each sub-activities
        for subProcedureActivity in subProcedureActivities:
            activities.append(subProcedureActivity)

    return activities

class Activity:
    def __init__(self, name, node_phrases):
        self.name = name  
        self.node_phrases = node_phrases
    
    def printSinglePhrase(self,phrase):
        return f"{phrase['clipId']} {phrase['level']}: {phrase['text']}"

    def __str__(self):
        phrases=""
        for phrase in self.node_phrases:
            phrases +="  "+ self.printSinglePhrase(phrase)+"\n"

        return f"Start\n {self.name}\n NodePhrases:\n{phrases}END"  # Correct: Returning a string

def writeXMLFile(output_dir,xml_content,xml_name):
    output_file = os.path.join(output_dir, f"{xml_name}.xml")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_content)

def writeAllActivities(data,output_dir):
    activities=retrieveAllActivities(data)
    for activity in activities:
        xml_content=create_activity_xml(activity.node_phrases)
        writeXMLFile(output_dir,xml_content,activity.name)