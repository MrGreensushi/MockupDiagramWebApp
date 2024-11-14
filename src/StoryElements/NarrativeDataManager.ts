import { CharacterElement, LocationElement, ObjectElement, StoryElement, StoryElementEnum, StoryElementType } from "./StoryElement.ts";

class NarrativeDataManager {
  // Variabile statica per memorizzare l'istanza del Singleton
  public static instance?: NarrativeDataManager;

  characters: CharacterElement[];
  objects: ObjectElement[];
  locations: LocationElement[];

  // Costruttore privato
  constructor() {
    if (NarrativeDataManager.instance) {
      throw new Error("Usa getInstance() per ottenere l'istanza della classe.");
    }

    // Proprietà per memorizzare le informazioni
    this.characters = [];
    this.objects = [];
    this.locations = [];
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
  addLocation(location: LocationElement) {
    if (!this.locations.includes(location)) {
      this.locations.push(location);
    }
  }

  add(element: StoryElementType) {
    switch (true) {
      case element instanceof CharacterElement:
        this.addCharacter(element);
      break;
      case element instanceof ObjectElement:
        this.addObject(element);
      break;
      case element instanceof LocationElement:
        this.addLocation(element);
      break;
    }
  }

  // Metodo per ottenere tutti i dati (opzionale, per comodità)
  getAllData() {
    return {
      characters: this.characters,
      objects: this.objects,
      backgrounds: this.locations,
    };
  }

  getAll(type: StoryElementEnum): StoryElementType[] {
    switch (type) {
      case StoryElementEnum.character:
        return this.characters;
      case StoryElementEnum.object:
        return this.objects;
      case StoryElementEnum.location:
        return this.locations;
      default:
        return [];
    }
  }

  getCharacterTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.characters);
  }
  getObjectTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.objects);
  }
  getBackgroundTypes(isVariable: boolean) {
    return this.getStoryElementTypes(isVariable, this.locations);
  }

  getStoryElementTypes(isVariable: boolean, array: StoryElement[]) {
    return(array.filter(storyElem => storyElem.isVariable === isVariable));
  }
}

export default NarrativeDataManager;
