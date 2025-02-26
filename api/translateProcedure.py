import json
# from googletrans import Translator

from deep_translator import GoogleTranslator
# Inizializza il traduttore
# translator = Translator()

def translate_procedure(data,dest_lang="it"):

    translator = GoogleTranslator(source="auto", target=dest_lang)
    # Iterare su tutte le procedure e tradurre i campi richiesti
    for procedure in data:
        if "flow" in procedure and "nodes" in procedure["flow"]:
            for node in procedure["flow"]["nodes"]:
                if "data" in node and "activity" in node["data"]:
                    content = node["data"]["activity"].get("content", {})

                    # Traduzione delle frasi nei nodePhrases
                    if "nodePhrases" in content:
                        for phrase in content["nodePhrases"]:
                            phrase["text"] = translate_text(phrase["text"],translator)

                    # Traduzione di details e notes
                    content["details"] = translate_text(content.get("details", ""),translator)
                    content["notes"] = translate_text(content.get("notes", ""),translator)

    return data

# Funzione per tradurre il testo
def translate_text(text, translator):
    if text.strip():  # Evita di tradurre stringhe vuote
        try:
            text=translator.translate(text)
            return text
        except Exception as e:
            print(f"Errore nella traduzione: {e}")
            return text  # Ritorna il testo originale in caso di errore
    return text



