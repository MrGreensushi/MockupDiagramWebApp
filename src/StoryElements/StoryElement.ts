import {v4 as uuidv4} from "uuid";

type StoryElementType = 
    | CharacterElement
    | ObjectElement
    | LocationElement; 

class StoryElement {
    name: string;
    notes: string;
    readonly isVariable: boolean;
    readonly id: string;

    protected constructor(isVariable: boolean, name: string, notes?: string) {
        this.isVariable = isVariable;
        this.id = uuidv4();
        this.notes = notes ?? "";
    }

    getDescription(): string {
        return this.toString();
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
    notes: string;

    constructor(isVariable: boolean, name: string, use?: string, notes?: string) {
        super(isVariable, name, notes);
        this.use = use ?? "";
        this.notes = notes ?? "";
    }
}

class LocationElement extends StoryElement{
    purpose: string;
    notes: string;

    constructor(isVariable: boolean, name: string, purpose?: string, notes?: string) {
        super(isVariable, name, notes);
        this.purpose = purpose ?? "";
        this.notes = notes ?? "";
    }
}

export {StoryElementType, StoryElement, CharacterElement, ObjectElement, LocationElement};