import StoryElement from "./StoryElement";

class ObjectData extends StoryElement{
    constructor(isVariable, type,id, use, notes = "") {
        super(isVariable, type,id)
        this.use = use;
        this.notes = notes;
    }

    // Metodo per ottenere una descrizione completa dell'oggetto
    getDescription() {
        return `Object: ${this.name}\nUse: ${this.use}\nNotes: ${this.notes}`;
    }
}
export default ObjectData;