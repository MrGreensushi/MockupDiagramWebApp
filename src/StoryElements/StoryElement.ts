enum StoryElementType {
    character = 0,
    object = 1,
    location = 2
}

const StoryElementTypeString = ["character", "object", "location"];

abstract class StoryElement {
    name: string;
    notes: string;
    isVariable: boolean;
    type: StoryElementType;

    constructor(isVariable: boolean, name: string, notes?: string) {
        this.name = name;
        this.notes = notes ?? "";
        this.isVariable = isVariable;
    }

    getDescription(): string {
        return `Name: ${this.name}`;
    }

    compare(other: StoryElement) {
        return this.name.localeCompare(other.name);
    }

    equals(other: StoryElement) {
        return (
            this.name === other.name &&
            this.notes === other.notes &&
            this.isVariable === other.isVariable);
    }
}

class CharacterElement extends StoryElement {
    bio: string;
    objective: string;
    
    constructor(isVariable: boolean, name: string, bio?: string, objective?: string, notes?: string) {
        super(isVariable, name, notes);
        this.bio = bio ?? "";
        this.objective = objective ?? "";
        this.type = StoryElementType.character;
    }
}

class ObjectElement extends StoryElement{
    use: string;

    constructor(isVariable: boolean, name: string, use?: string, notes?: string) {
        super(isVariable, name, notes);
        this.use = use ?? "";
        this.type = StoryElementType.object;
    }
}

class LocationElement extends StoryElement{
    purpose: string;

    constructor(isVariable: boolean, name: string, purpose?: string, notes?: string) {
        super(isVariable, name, notes);
        this.purpose = purpose ?? "";
        this.type = StoryElementType.location;
    }
}

export {StoryElement, CharacterElement, ObjectElement, LocationElement, StoryElementType, StoryElementTypeString};