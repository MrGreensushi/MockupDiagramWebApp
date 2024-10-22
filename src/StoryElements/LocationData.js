import StoryElement from "./StoryElement";

class LocationtData extends StoryElement{
    constructor(isVariable, type,id, purpose, notes = "") {
        super(isVariable, type, id)
        this.purpose = purpose;
        this.notes = notes;
    }

    // Metodo per ottenere una descrizione completa dell'oggetto
    getDescription() {
        return `Location: ${this.name}\nPurpose: ${this.purpose}\nNotes: ${this.notes}`;
    }
}

export default LocationtData;