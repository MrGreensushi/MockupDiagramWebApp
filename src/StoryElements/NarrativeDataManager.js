import ObjectData from "./ObjectData";
import CharacterData from "./CharacterData";
import LocationtData from "./LocationData";

class NarrativeDataManager {
  // Variabile statica per memorizzare l'istanza del Singleton
  static instance = null;

  // Costruttore privato
  constructor() {
    if (NarrativeDataManager.instance) {
      throw new Error("Usa getInstance() per ottenere l'istanza della classe.");
    }

    // Proprietà per memorizzare le informazioni
    this.characters = [];
    this.backgrounds = [];
    this.objects = [];
  }

  // Metodo statico per ottenere l'istanza unica
  static getInstance() {
    if (!NarrativeDataManager.instance) {
      NarrativeDataManager.instance = new NarrativeDataManager();
    }
    return NarrativeDataManager.instance;
  }

  isElementACharacter(element) {
    if (!(element instanceof CharacterData)) {
      throw new Error(
        "Element is not an instance of Character Class: ",
        element
      );
    }
  }

  isElementAnObject(element) {
    if (!(element instanceof ObjectData)) {
      throw new Error(
        "Element is not an instance of ObjectData Class: ",
        element
      );
    }
  }

  isElementALocation(element) {
    if (!(element instanceof LocationtData)) {
      throw new Error(
        "Element is not an instance of LocationData Class: ",
        element
      );
    }
  }

  checkInstace(element,func){
    var toRet=false
    try {
        func(element)
        toRet=true
    } catch (error) {
        console.error(error);
    }
    return toRet;
  }

  // Metodo per aggiungere un personaggio principale
  addCharacter(character) {
    if(!this.checkInstace(character, this.isElementACharacter))
        return;

    this.characters.push(character);
  }

  // Metodo per aggiungere un oggetto
  addObject(object) {
    if(!this.checkInstace(object, this.isElementAnObject))
        return;

    this.objects.push(object);
  }

  // Metodo per aggiungere un background
  addBackground(background) {
    if(!this.checkInstace(background, this.isElementALocation))
        return;

    this.backgrounds.push(background);
  }

  // Metodo per ottenere tutti i dati (opzionale, per comodità)
  getAllData() {
    return {
      characters: this.characters,
      backgrounds: this.backgrounds,
      objects: this.objects,
    };
  }
}

export default NarrativeDataManager;
