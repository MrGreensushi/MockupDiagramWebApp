class ObjectData {
    constructor(name, use, notes = "") {
        this.name = name;
        this.use = use;
        this.notes = notes;
    }

    // Metodo per ottenere una descrizione completa dell'oggetto
    getDescription() {
        return `Object: ${this.name}\nUse: ${this.use}\nNotes: ${this.notes}`;
    }
}
export default ObjectData;