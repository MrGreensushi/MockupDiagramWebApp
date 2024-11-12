import { CharacterElement, LocationElement, ObjectElement, StoryElement } from "./StoryElement";

class NarrativeDataManager {
  // Variabile statica per memorizzare l'istanza del Singleton
  static instance?: NarrativeDataManager;

  characters: CharacterElement[];
  objects: ObjectElement[];
  backgrounds: LocationElement[];

  // Costruttore privato
  constructor() {
    if (NarrativeDataManager.instance) {
      throw new Error("Usa getInstance() per ottenere l'istanza della classe.");
    }

    // Proprietà per memorizzare le informazioni
    this.characters = [];
    this.objects = [];
    this.backgrounds = [];
  }

  // Metodo statico per ottenere l'istanza unica
  static getInstance(): NarrativeDataManager {
    if (!NarrativeDataManager.instance) {
      NarrativeDataManager.instance = new NarrativeDataManager();
    }
    return NarrativeDataManager.instance;
  }

  // Metodo per aggiungere un personaggio principale
  addCharacter(character: CharacterElement) {
    if (!this.characters.includes(character)) {
      this.characters.push(character);
    }
  }

  // Metodo per aggiungere un oggetto
  addObject(object: ObjectElement) {
    if (!this.objects.includes(object)) {
      this.objects.push(object);
    }

  }

  // Metodo per aggiungere un background
  addBackground(background: LocationElement) {
    if (!this.backgrounds.includes(background)) {
      this.backgrounds.push(background);
    }
  }

  // Metodo per ottenere tutti i dati (opzionale, per comodità)
  getAllData() {
    return {
      characters: this.characters,
      objects: this.objects,
      backgrounds: this.backgrounds,
    };
  }

  getCharacterTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.characters);
  }
  getObjectTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.objects);
  }
  getBackgroundTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.backgrounds);
  }

  getStoryElementTypes(isVariable: boolean, array: StoryElement[]) {
    return(array.filter(storyElem => storyElem.isVariable === isVariable));
  }
}

export default NarrativeDataManager;
