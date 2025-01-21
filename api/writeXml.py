import os
import json
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString
from io import BytesIO
import zipfile

# Funzione per creare l'XML
def create_activity_xml(activity):
    root = Element('node')
    # Lingua italiana
    language_xml(root,activity.ita,'ITA')
    language_xml(root,activity.eng,'ENG')

    # Convertire l'albero XML in una stringa formattata
    xml_str = parseString(tostring(root, encoding="unicode")).toprettyxml(indent="   ").replace("&quot;","\"")

    return xml_str

def language_xml(root,activityLang,lang):
    # Lingua italiana
    ita = SubElement(root, 'language', value=lang)
    for phrase in activityLang.node_phrases:
        if phrase['clipId'] == 'Description':
            desc = SubElement(ita, 'description', level=phrase['level'])
            desc.text = phrase.get('text', phrase['level'])
        else:
            node_phrase = SubElement(ita, 'nodePhrase', clipId=phrase['clipId'], level=phrase['level'])
            node_phrase.text = phrase.get('text', phrase['clipId'])
    details=SubElement(ita,'details',level='Notice')
    details.text=activityLang.details

def retrieveAllActivities(data):
    activities = []

    for node in data.get('flow', {}).get('nodes', []):
        #retrieve the single activity
        activity = node.get('data', {}).get('activity', None)
        if not activity: 
            continue
        
        #activity contains aslo subProcedure but we are interested only in the name e phrases
        slimActivity= Activity(activity.get('name',""), activity.get('languages',{}))
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
    def __init__(self, name, languages):
        self.name = name  
        itaLang=languages.get('itaActivity',None)
        itaPhrase=itaLang.get('nodePhrases',[])
        itaDetails=itaLang.get('details',"")
        self.ita = LanguageActivity(itaPhrase,itaDetails)
        engLang=languages.get('engActivity',None)
        engPhrase=engLang.get('nodePhrases',[])
        engDetails=engLang.get('details',"")
        self.eng = LanguageActivity(engPhrase,engDetails)
    
    def printSinglePhrase(self,phrase):
        return f"{phrase['clipId']} {phrase['level']}: {phrase['text']}"

    def __str__(self):
        phrases=""
        for phrase in self.node_phrases:
            phrases +="  "+ self.printSinglePhrase(phrase)+"\n"

        return f"Start\n {self.name}\n NodePhrases:\n{phrases}END"  # Correct: Returning a string

class LanguageActivity:
    def __init__(self,node_phrases,details):
        self.details = details  
        self.node_phrases = node_phrases


def zipAllActivitiesXmls(data):
    activities=retrieveAllActivities(data)
    xmls=[]
    for activity in activities:
        xml_content=create_activity_xml(activity)
        #writeXMLFile(output_dir,xml_content,activity.name)
        xmls.append((f"{activity.name}.xml", xml_content))
    # Preparare un archivio ZIP contenente tutti i file XML
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr(f"{data.get('title','no-title')}.procedure", json.dumps(data, ensure_ascii=False))
        for filename, xml_content  in xmls:
            zip_file.writestr(filename, xml_content )
    zip_buffer.seek(0)
    return zip_buffer