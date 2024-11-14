import {v4 as uuidv4} from "uuid";

enum StoryElementEnum {
    character = 0,
    object = 1,
    location = 2
}

type StoryElementType = 
    | CharacterElement
    | ObjectElement
    | LocationElement; 

class StoryElement {
    name: string;
    notes: string;
    readonly isVariable: boolean;
    readonly id: string;

    constructor(isVariable: boolean, name: string, notes?: string) {
        this.name = name;
        this.notes = notes ?? "";
        this.isVariable = isVariable;
        this.id = uuidv4();
    }

    getDescription(): string {
        return `Name: ${this.name}`;
    }
}

class CharacterElement extends StoryElement {
    bio: string;
    objective: string;
    
    constructor(isVariable: boolean, name: string, bio?: string, objective?: string, notes?: string) {
        super(isVariable, name, notes);
        this.bio = bio ?? "";
        this.objective = objective ?? "";
    }
}

class ObjectElement extends StoryElement{
    use: string;

    constructor(isVariable: boolean, name: string, use?: string, notes?: string) {
        super(isVariable, name, notes);
        this.use = use ?? "";
    }
}

class LocationElement extends StoryElement{
    purpose: string;

    constructor(isVariable: boolean, name: string, purpose?: string, notes?: string) {
        super(isVariable, name, notes);
        this.purpose = purpose ?? "";
    }
}

export {StoryElement, CharacterElement, ObjectElement, LocationElement, StoryElementEnum, StoryElementType};