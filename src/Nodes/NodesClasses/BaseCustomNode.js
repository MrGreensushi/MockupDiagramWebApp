class BaseCustomNode {
  // enum per Section e Level
  static Sections = Object.freeze({
    DESCRIPTIONS: "descriptions",
    NODE_PHRASES: "nodePhrases",
  });

  static Levels = Object.freeze({
    EXPERT: "Expert",
    INTERMEDIATE: "Intermediate",
    NOVICE: "Novice",
  });

  static Languages = Object.freeze({
    ITA: "ITA",
    ENG: "ENG",
  });

  // Controlla se il valore di 'section' è valido
  static isValidSection(section) {
    return Object.values(this.Sections).includes(section);
  }

  // Controlla se il valore di 'level' è valido
  static isValidLevel(level) {
    return Object.values(this.Levels).includes(level);
  }

  // Controlla se il valore di 'level' è valido
  static isValidLanguage(language) {
    return Object.values(this.Languages).includes(language);
  }

  constructor(name) {
    this.label = name;
    this._descriptions = new Description();
    this._nodePhrases = new NodePhrase();
  }

  get descriptions() {
    return this._descriptions;
  }

  get nodePhrases() {
    return this._nodePhrases;
  }

  /**
   * @param {Description} newnodedescriptions
   */
  set descriptions(newnodedescriptions) {
    this.descriptions.assign(newnodedescriptions);
  }

  /**
   * @param {NodePhrase} newnodePhrases
   */
  set nodePhrases(newnodePhrases) {
    this.nodePhrases.assign(newnodePhrases);
  }

  /**
   * @param {BaseCustomNode} nodeInfo
   */
  assign(nodeInfo) {
    if(!nodeInfo)
      return;

    this.label = nodeInfo.label;
    this.descriptions.assign(nodeInfo.descriptions);
    this.nodePhrases.assign(nodeInfo.nodePhrases);
  }

 /**
   * @param {BaseCustomNode} initializeFrom
   */
  static initialize(initializeFrom){
    const newBasNode = new BaseCustomNode(initializeFrom.name);
    newBasNode.assign(initializeFrom);
    return newBasNode;
  }
}

class Description {
  constructor() {
    this.ITA = new DescriptionLevels();
    //this.ENG=new DescriptionLevel();
  }

  static intialize(initializeFrom) {
    const description = new Description();
    description.assign(initializeFrom);
    return description;
  }

  /**
   * @param {Descriptions} newDescriptions
   */
  assign(newDescriptions) {
    if (!newDescriptions) return;

    // Clonazione profonda di ITA
    this.ITA = new DescriptionLevels();
    this.ITA.assign(newDescriptions.ITA);

    // Clonazione profonda di ENG (se presente)
    // this.ENG = new DescriptionLevels();
    // this.ENG.assign(newDescriptions.ENG);
  }

  updateDescription(language, level, value) {
    if (language === "ITA") {
      this.ITA.setLevel(level, value);
    }
  }
}

class DescriptionLevels {
  constructor() {
    this.Novice = "";
    this.Intermediate = "";
    this.Expert = "";
  }

  /**
   * Clonazione profonda di un oggetto DescriptionLevels
   * @param {DescriptionLevels} toAssign
   */
  assign(toAssign) {
    if (!toAssign) return;

    this.Novice = toAssign.Novice;
    this.Intermediate = toAssign.Intermediate;
    this.Expert = toAssign.Expert;
  }

  setLevel(level, value) {
    switch (level) {
      case "Novice":
        this.Novice = value;
        break;
      case "Intermediate":
        this.Intermediate = value;
        break;
      case "Expert":
        this.Expert = value;
        break;
    }
  }
}

class NodePhrase {
  constructor() {
    this.ITA = new NodePhrasesLevel();
    //this.ENG=new DescriptionLevel();
  }

  static intialize(initializeFrom){
    const nodePhrase = new NodePhrase();
    nodePhrase.assign(initializeFrom);
    return nodePhrase;
  }

  /**
   * @param {NodePhrases} newPhrases
   */
  assign(newPhrases) {
     if (!newPhrases) return;

    // Clonazione profonda di ITA
    this.ITA = new NodePhrasesLevel();
    this.ITA.assign(newPhrases.ITA);

    // Clonazione profonda di ENG (se presente)
    // this.ENG = new NodePhrasesLevel();
    // this.ENG.assign(newPhrases.ENG);
  }

  updateNodePhrase(language, level, clipId, text) {
    const newPhraseValue = new NodePhraseValue(clipId, text);
    if (language === "ITA") {
      this.ITA.addOrUpdateLevel(level, newPhraseValue);
    }
  }

  count(language,level){
    if(language==="ITA")
      return this.ITA.count(level)
  }
}

class NodePhrasesLevel {
  constructor() {
    this.Novice = [];
    this.Intermediate = [];
    this.Expert = [];
  }

   /**
   * Clonazione profonda di un oggetto NodePhrasesLevel
   * @param {NodePhrasesLevel} toAssign
   */
   assign(toAssign) {
    if (!toAssign || !(toAssign instanceof NodePhrasesLevel)) 
      return;
    // Clonazione profonda degli array
    this.Novice = toAssign.Novice.map(
      (phrase) => new NodePhraseValue(phrase.clipId, phrase.text)
    );
    this.Intermediate = toAssign.Intermediate.map(
      (phrase) => new NodePhraseValue(phrase.clipId, phrase.text)
    );
    this.Expert = toAssign.Expert.map(
      (phrase) => new NodePhraseValue(phrase.clipId, phrase.text)
    );
  }

  addOrUpdateLevel(level, newPhraseValue) {

    const array=this.getLevelArray(level)
    this.addOrUpdateToArray(array,newPhraseValue)

  }

  count(level) {
    return this.getLevelArray(level).length
  }

  getLevelArray(level){
    switch (level) {
      case "Novice":
        return this.Novice
      case "Intermediate":
        return this.Intermediate
      case "Expert":
        return this.Expert
    }
  }


  addOrUpdateToArray(array,newValue){
    const index=array.findIndex(x=>x.clipId===newValue.clipId)
    if(index>=0 && index<array.length)
    {
      array[index]=newValue;
    }
    else{
      array.push(newValue);
    }
    return array
  }
}

class NodePhraseValue {
  constructor(clipId, text) {
    this.clipId = clipId;
    this.text = text;
  }

  /**
   * Clonazione profonda di un oggetto NodePhraseValue
   * @param {NodePhraseValue} newPhraseValue
   */
  assign(newPhraseValue) {
    if (!newPhraseValue) return;

    this.clipId = newPhraseValue.clipId;
    this.text = newPhraseValue.text;
  }
}

export { BaseCustomNode, Description, NodePhrase };
