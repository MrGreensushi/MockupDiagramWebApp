import { BaseCustomNode, Description, NodePhrase } from "./BaseCustomNode";

class ImportedNodeInfo extends BaseCustomNode {
  constructor(data) {
    super(data.Name);
    this.initializeDescriptions({ ITA: data.ITA.descriptions });
    this.initializeNodePhrases({ ITA: data.ITA.nodePhrases });
  }

  initialize(descriptions, nodePhrase) {}

  initializeDescriptions(descriptions) {
    const newDescription = new Description();
    //per ogni linguaggio
    Object.keys(descriptions).map((language) => {
      //per ogni livello
      Object.keys(descriptions[language]).map((level) => {
        //aggiungi la descrizione
        newDescription.updateDescription(
          language,
          level,
          descriptions[language][level]
        );
      });
    });

    this.descriptions = newDescription;
  }

  initializeNodePhrases(nodePhrases) {
    const newnodePhrases = new NodePhrase();
    //per ogni linguaggio
    Object.keys(nodePhrases).map((language) => {
      //per ogni livello
      Object.keys(nodePhrases[language]).map((level) => {
        //per ogni clipId
        Object.keys(nodePhrases[language][level]).map((clipId) => {
          newnodePhrases.updateNodePhrase(
            language,
            level,
            clipId,
            nodePhrases[language][level][clipId]
          );
        });
      });
    });
    this.nodePhrases = newnodePhrases;
  }
}

export default ImportedNodeInfo;
