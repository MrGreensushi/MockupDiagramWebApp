import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
import os
# Function to parse the XML file
def parse_activity_xml(file_path):
# Parse the XML file
    tree = ET.parse(file_path)
    root = tree.getroot()
    file_name = os.path.splitext(os.path.basename(file_path))[0]
    # Dictionary to hold parsed content
    parsed_data = {'Name':file_name}

    # Iterate over language nodes
    for language in root.findall('language'):
        lang_code = language.get('value')
        parsed_data[lang_code] = {
            'descriptions': {},
            'nodePhrases': {},
            'details':{}
        }

        # Extract descriptions by level (Novice, Intermediate, Expert)
        for description in language.findall('description'):
            level = description.get('level')
            text = description.text.strip() if description.text else ""
            parsed_data[lang_code]['descriptions'][level] = text
        
        #Extract details
        for detail in language.findall('details'):
            level = detail.get('level')
            text = detail.text.strip() if detail.text else ""
            parsed_data[lang_code]['details']= text

        # Extract node phrases by level (Novice, Intermediate, Expert)
        for nodePhrase in language.findall('nodePhrase'):
            level = nodePhrase.get('level')
            clipId = nodePhrase.get('clipId')
            text = nodePhrase.text.strip() if nodePhrase.text else ""
            
            if level not in parsed_data[lang_code]['nodePhrases']:
                parsed_data[lang_code]['nodePhrases'][level] = {}

            parsed_data[lang_code]['nodePhrases'][level][clipId] = text

    return parsed_data

def parse_all_xmls(folder_path):
    parsed_content=[]
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.xml'):
                file_path = os.path.join(root, file)
                parsed_content.append(parse_activity_xml(file_path))
    
    return parsed_content
                

def write_node_to_xml(node,filepath):
    # Create the root element <node>
    root = ET.Element("node")
    filename=f"{filepath}\\{node['label']}.xml"
    # Process each language (here, we'll assume data has descriptions for ITA and ENG)
    for lang_code, lang_data in node['descriptions'].items():
        language_element = ET.SubElement(root, "language", value=lang_code)
        
        # Add descriptions for each level (Expert, Intermediate, Novice)
        for level, description in lang_data.items():
            description_element = ET.SubElement(language_element, "description", level=level)
            description_element.text = description

        # Add details for "Novice" level (empty tag)
        details_element = ET.SubElement(language_element, "details", level="Novice")

        # Add nodePhrases, assuming `nodePhrases` might also have similar structure
        for level, phrases in node['nodePhrases'].get(lang_code, {}).items():
            for clipId, text in phrases.items():
                node_phrase_element = ET.SubElement(language_element, "nodePhrase", clipId=clipId, level=level)
                node_phrase_element.text = text

    # Create the XML tree and write it to file
    tree = ET.ElementTree(root)
    
    # Convert the tree to a string and prettify it using minidom
    xml_str = ET.tostring(root, encoding='utf-8', method='xml')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")

    # Write the prettified XML to file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)