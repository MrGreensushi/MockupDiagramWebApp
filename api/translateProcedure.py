import re
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

def translate_activity(data,dest_lang="it"):
    translator = GoogleTranslator(source="auto", target=dest_lang)
    
    # Traduzione delle frasi nei nodePhrases
    for phrase in data.node_phrases:
        phrase["text"] = translate_text(phrase["text"],translator)

    # Traduzione di details e notes
    data.details = translate_text(data.details,translator)
    data.notes = translate_text(data.notes,translator)

    return data
# Funzione per tradurre il testo
def translate_text(text, translator):
    if not text.strip():  # Evita di tradurre stringhe vuote
        return text
    
    try:
        # Regex per trovare blocchi racchiusi tra parentesi graffe
        pattern_blocks = r'(\{[^}]*\})'

        # Regex per trovare "chiave":"valore" dentro le parentesi graffe
        pattern_key_value = r'"([^"]+)":"([^"]+)"'

        def translate_block(match):
            block = match.group(1)  # Testo completo tra {}
            
            def translate_key_value(m):
                key = m.group(1)   # Nome della chiave (NON va tradotto)
                value = m.group(2) # Valore da tradurre
                
                translated_value = translateText(value,translator)
                toRet= f'"{key}":"{translated_value}"'
                return toRet
            
            # Sostituiamo solo i valori tradotti all'interno del blocco
            translated_block = re.sub(pattern_key_value, translate_key_value, block)
            return translated_block
        
        # Suddivide il testo nei blocchi tra parentesi graffe e il resto
        parts = re.split(pattern_blocks, text)

        translated_text = ""
        for part in parts:
            if part.startswith("{") and part.endswith("}"):
                # Se è un blocco tra {}, lo elaboriamo con translate_block()
                translated_text += translate_block(re.match(pattern_blocks, part))
            else:
                # Se è testo normale, lo traduciamo interamente
                translated_text +=translateText(part,translator)
        return translated_text

    except Exception as e:
        print(f"Errore nella traduzione: {e}")
        return text  # Ritorna il testo originale in caso di errore
    
def translateText(text,translator):
    if text.strip():
        return translator.translate(text)
    return text


LANGUAGES_TO_3LETTER = {
    "af": "AFK", "sq": "ALB", "am": "AMH", "ar": "ARA", "hy": "ARM", "az": "AZE",
    "eu": "EUS", "be": "BEL", "bn": "BEN", "bs": "BOS", "bg": "BUL", "ca": "CAT",
    "ceb": "CEB", "ny": "NYA", "zh-CN": "CHS", "zh-TW": "CHT", "co": "COS", "hr": "HRV",
    "cs": "CZE", "da": "DAN", "nl": "NLD", "en": "ENG", "eo": "EPO", "et": "EST",
    "tl": "FIL", "fi": "FIN", "fr": "FRA", "fy": "FRY", "gl": "GLG", "ka": "GEO",
    "de": "DEU", "el": "GRE", "gu": "GUJ", "ht": "HAT", "ha": "HAU", "haw": "HAW",
    "iw": "HEB", "he": "HEB", "hi": "HIN", "hmn": "HMN", "hu": "HUN", "is": "ISL",
    "ig": "IBO", "id": "IND", "ga": "GLE", "it": "ITA", "ja": "JPN", "jw": "JAV",
    "kn": "KAN", "kk": "KAZ", "km": "KHM", "ko": "KOR", "ku": "KUR", "ky": "KIR",
    "lo": "LAO", "la": "LAT", "lv": "LAV", "lt": "LIT", "lb": "LTZ", "mk": "MKD",
    "mg": "MLG", "ms": "MSA", "ml": "MAL", "mt": "MLT", "mi": "MRI", "mr": "MAR",
    "mn": "MON", "my": "MYA", "ne": "NEP", "no": "NOR", "or": "ORI", "ps": "PAS",
    "fa": "PER", "pl": "POL", "pt": "POR", "pa": "PAN", "ro": "RON", "ru": "RUS",
    "sm": "SMO", "gd": "GLA", "sr": "SRP", "st": "SOT", "sn": "SNA", "sd": "SND",
    "si": "SIN", "sk": "SLK", "sl": "SLV", "so": "SOM", "es": "SPA", "su": "SUN",
    "sw": "SWA", "sv": "SWE", "tg": "TGK", "ta": "TAM", "te": "TEL", "th": "THA",
    "tr": "TUR", "uk": "UKR", "ur": "URD", "ug": "UIG", "uz": "UZB", "vi": "VIE",
    "cy": "WEL", "xh": "XHO", "yi": "YID", "yo": "YOR", "zu": "ZUL"
}

def get_language_code_3letters(code: str):
    """Restituisce un codice lingua a tre lettere in maiuscolo."""
    name_3letters = LANGUAGES_TO_3LETTER.get(code, "UNK")  # Default: "UNK"
    return {"code": code, "name": name_3letters}