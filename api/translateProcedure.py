import json
from googletrans import Translator


# Inizializza il traduttore
translator = Translator()

def translate_procedure(data,dest_lang="it"):

    # Iterare su tutte le procedure e tradurre i campi richiesti
    for procedure in data:
        if "flow" in procedure and "nodes" in procedure["flow"]:
            for node in procedure["flow"]["nodes"]:
                if "data" in node and "activity" in node["data"]:
                    content = node["data"]["activity"].get("content", {})

                    # Traduzione delle frasi nei nodePhrases
                    if "nodePhrases" in content:
                        for phrase in content["nodePhrases"]:
                            phrase["text"] = translate_text(phrase["text"],dest_lang)

                    # Traduzione di details e notes
                    content["details"] = translate_text(content.get("details", ""),dest_lang )
                    content["notes"] = translate_text(content.get("notes", ""),dest_lang)

    return data

# Funzione per tradurre il testo
def translate_text(text, dest_lang):
    if text.strip():  # Evita di tradurre stringhe vuote
        try:
            return translator.translate(text, dest=dest_lang).text
        except Exception as e:
            print(f"Errore nella traduzione: {e}")
            return text  # Ritorna il testo originale in caso di errore
    return text



