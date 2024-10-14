import {BaseCustomNode} from "./BaseCustomNode";
import ImportedNodeInfo from "./ImportedNodeInfo";

class GraphNodeData extends BaseCustomNode {
  constructor(id, name) {
    super(name);
    this.id = id;
    
  }

 /**
   * Estende il metodo `assign` dalla classe BaseCustomNode
   * @param {GraphNodeData} initializeFrom - Oggetto da cui clonare i dati
   */
 assign(initializeFrom) {
  if (!initializeFrom) return;

  // Chiamo il metodo assign della classe padre
  super.assign(initializeFrom);

  // Aggiungo la logica per l'ID
  if(initializeFrom instanceof GraphNodeData)
    this.id = initializeFrom.id;
}

 /**
   * @param {GraphNodeData} initializeFrom
   */
 static initialize(initializeFrom){
  if (!initializeFrom) return;

  const newNode=new GraphNodeData(initializeFrom.id,initializeFrom.label);
  
  newNode.assign(initializeFrom);
  
  return newNode;
}


  /**
   * @param {ImportedNodeInfo} nodeInfo
   */
  updateFromImportedNodeInfo(nodeInfo) {
    this.label = nodeInfo.name;
    this.descriptions = nodeInfo.descriptions;
    this.nodePhrases = nodeInfo.nodePhrases;
  }
}


export default GraphNodeData;
