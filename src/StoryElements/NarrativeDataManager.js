import ObjectContainer from "./ObjectContainer";
import CharacterContainer from "./CharacterContainer";
import LocationContainer from "./BackgroundContainer";
import StoryElementDescriptor from "./StoryElementDescriptor";

class NarrativeDataManager {
  // Variabile statica per memorizzare l'istanza del Singleton
  static instance = null;

  // Costruttore privato
  constructor() {
    if (NarrativeDataManager.instance) {
      throw new Error("Usa getInstance() per ottenere l'istanza della classe.");
    }

    // Proprietà per memorizzare le informazioni
    this.characterContainers = [];
    this.backgroundContainers = [];
    this.objectContainers = [];

    this.characterDescriptors = [];
    this.backgroundDescriptors = [];
    this.objectDescriptors = [];
  }

  // Metodo statico per ottenere l'istanza unica
  static getInstance() {
    if (!NarrativeDataManager.instance) {
      NarrativeDataManager.instance = new NarrativeDataManager();
    }
    return NarrativeDataManager.instance;
  }

  isElementACharacter(element) {
    if (!(element instanceof CharacterContainer)) {
      throw new Error(
        "Element is not an instance of Character Class: ",
        element
      );
    }
  }

  isElementAnObject(element) {
    if (!(element instanceof ObjectContainer)) {
      throw new Error(
        "Element is not an instance of ObjectData Class: ",
        element
      );
    }
  }

  isElementALocation(element) {
    if (!(element instanceof LocationContainer)) {
      throw new Error(
        "Element is not an instance of LocationData Class: ",
        element
      );
    }
  }

  isElementAStoryElementDescriptor(element) {
    if (!(element instanceof StoryElementDescriptor)) {
      throw new Error(
        "Element is not an instance of StoryElementDescriptor Class: ",
        element
      );
    }
  }

  checkInstace(element, func) {
    var toRet = false;
    try {
      func(element);
      toRet = true;
    } catch (error) {
      console.error(error);
    }
    return toRet;
  }

  addBackgroundDescriptor(backgroundDescriptor) {
    if (
      !this.checkInstace(
        backgroundDescriptor,
        this.isElementAStoryElementDescriptor
      )
    )
      return;
    if (
      this.backgroundDescriptors.some((x) =>
        StoryElementDescriptor.checkIfSame(x, backgroundDescriptor)
      )
    )
      return;
    this.backgroundDescriptors.push(backgroundDescriptor);
  }

  addCharacterDescriptor(charactersDescriptor) {
    if (
      !this.checkInstace(
        charactersDescriptor,
        this.isElementAStoryElementDescriptor
      )
    )
      return;
    if (
      this.characterDescriptors.some((x) =>
        StoryElementDescriptor.checkIfSame(x, charactersDescriptor)
      )
    )
      return;
    this.characterDescriptors.push(charactersDescriptor);
  }

  addObjectDescriptor(objectDescriptor) {
    if (
      !this.checkInstace(
        objectDescriptor,
        this.isElementAStoryElementDescriptor
      )
    )
      return;
    if (
      this.objectDescriptors.some((x) =>
        StoryElementDescriptor.checkIfSame(x, objectDescriptor)
      )
    )
      return;
    this.objectDescriptors.push(objectDescriptor);
  }

  // Metodo per aggiungere un personaggio principale
  addCharacter(character) {
    if (!this.checkInstace(character, this.isElementACharacter)) return;

    if (this.characterContainers.includes(character)) return;
    this.characterContainers.push(character);
  }

  // Metodo per aggiungere un oggetto
  addObject(object) {
    if (!this.checkInstace(object, this.isElementAnObject)) return;
    if (this.objectContainers.includes(object)) return;
    this.objectContainers.push(object);
  }

  // Metodo per aggiungere un background
  addBackground(background) {
    if (!this.checkInstace(background, this.isElementALocation)) return;
    if (this.backgroundContainers.includes(background)) return;
    this.backgroundContainers.push(background);
  }

  // Metodo per ottenere tutti i dati (opzionale, per comodità)
  getAllData() {
    return {
      characters: this.characterContainers,
      backgrounds: this.backgroundContainers,
      objects: this.objectContainers,
    };
  }

  getCharacterTypes(isVariable){
    console.log( this.characterDescriptors)
    return this.characterDescriptors.filter(x=>x.isVariable==isVariable);

  }

  isCharacterContainerIdUnique(id){
    return !(this.characterContainers.some(x=>x.id===id))
  }

  getObjectTypes(isVariable){
    return this.objectDescriptors.filter(x=>x.isVariable==isVariable);

  }

  isObjectContainerIdUnique(id){
    return !(this.objectContainers.some(x=>x.id===id))
  }

  getBackgroundTypes(isVariable){
    return this.backgroundDescriptors.filter(x=>x.isVariable==isVariable);
  }

  isBackgroundContainerIdUnique(id){
    return !(this.backgroundContainers.some(x=>x.id===id))
  }
}

export default NarrativeDataManager;
