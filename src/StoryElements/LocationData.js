class LocationtData {
    constructor(name, purpose, notes = "") {
        this.name = name;
        this.purpose = purpose;
        this.notes = notes;
    }

    // Metodo per ottenere una descrizione completa dell'oggetto
    getDescription() {
        return `Location: ${this.name}\nPurpose: ${this.purpose}\nNotes: ${this.notes}`;
    }
}

export default LocationtData;