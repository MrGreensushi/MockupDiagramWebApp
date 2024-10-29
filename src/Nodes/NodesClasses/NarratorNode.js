class NarratorNode {
  constructor(
    name,
    id,
    mainCharacters = [],
    BackgroundCharacters = [],
    Objects = [],
    Background = null,
    Time = null,
    Weather = null,
    Tones = null,
    Values = null,
    Prompt = "",
    NextNodes = []
  ) {
    this.label = name;
    this.id = id;
    this.mainCharacters = mainCharacters;
    this.BackgroundCharacters = BackgroundCharacters;
    this.Objects = Objects;
    this.Background = Background;
    this.Time = Time;
    this.Weather = Weather;
    this.Tones = Tones;
    this.Values = Values;
    this.Prompt = Prompt;
    this.NextNodes = [...NextNodes];
  }

  static inizialize(node) {
    return new NarratorNode(
      node.label,
      node.id,
      [...node.mainCharacters], // Copia dell'array dei personaggi principali
      [...node.BackgroundCharacters], // Copia dell'array dei personaggi di sfondo
      [...node.Objects], // Copia dell'array degli oggetti
      node.Background, // Valori primitivi non hanno bisogno di essere copiati profondamente
      node.Time,
      node.Weather,
      node.Tones,
      node.Values,
      node.Prompt,
      node.NextNodes ? [...node.NextNodes] : [] // Copia dell'array di NextNodes, se presente
    );
  }

  // Metodo di istanza per creare una copia di se stesso
  copy() {
    return new NarratorNode(
      this.label,
      this.id,
      [...this.mainCharacters],
      [...this.BackgroundCharacters],
      [...this.Objects],
      this.Background,
      this.Time,
      this.Weather,
      this.Tones,
      this.Values,
      this.Prompt,
      this.NextNodes ? [...this.NextNodes] : []
    );
  }

  removeNextNodeId(nodeId){
    this.NextNodes= this.NextNodes.filter(id=>id!==nodeId)

  }
}

export default NarratorNode;
