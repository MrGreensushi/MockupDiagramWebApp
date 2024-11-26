import {v4 as uuidv4} from "uuid";
import { ReactFlowJsonObject } from "@xyflow/react";
import { CharacterElement, LocationElement, ObjectElement, StoryElementEnum, StoryElementType } from "./StoryElement.ts";

type SerializedStory = {
    characters: CharacterElement[],
    objects: ObjectElement[],
    locations: LocationElement[],
    flow: ReactFlowJsonObject
}

class Story {
    characters: Map<string, CharacterElement>;
    objects: Map<string, ObjectElement>;
    locations: Map<string, LocationElement>;
    flow: ReactFlowJsonObject;

    constructor(
        characters: CharacterElement[] = [],
        objects: ObjectElement[] = [],
        locations: LocationElement[] = [],
        flow: ReactFlowJsonObject = {nodes: [], edges: [], viewport: {x: 0, y: 0, zoom: 1}}
    ) {
        this.characters = new Map();
        characters.forEach(char => this.characters.set(uuidv4(), char));
        this.objects = new Map();
        objects.forEach(obj => this.objects.set(uuidv4(), obj));
        this.locations = new Map();
        locations.forEach(loc => this.locations.set(uuidv4(), loc));
        this.flow = flow;
    }

    clone(): Story {
        return new Story([...this.characters.values()], [...this.objects.values()], [...this.locations.values()], this.flow); 
    }

    getByType(type: StoryElementEnum) {
        return this.getTypeIteratorByEnum(type);
    }

    canAddElement(element: StoryElementType): boolean {
        const map = this.getTypeMap(element);
        return ![...map.values()].some(el => el.name === element.name);
    }

    addElement(element: StoryElementType) {
        const map = this.getTypeMap(element);
        if (this.canAddElement(element)) {
            map.set(uuidv4(), element);
        }
        return true;
    }

    cloneAndAddElement(element: StoryElementType): Story {
        const newStory = this.clone();
        newStory.addElement(element);
        return newStory;
    }

    cloneAndAddFlow(flow: ReactFlowJsonObject) {
        const newStory = this.clone();
        newStory.flow = flow;
        return newStory;
    }

    setElement(id: string, element: StoryElementType) {
        const iter = this.getTypeMap(element);
        iter.set(id, element);
    }

    getTypeMap(element: StoryElementType): Map<string, StoryElementType> {
        switch (true) {
            case element instanceof CharacterElement:
                return this.characters;
            case element instanceof ObjectElement:
                return this.objects;
            case element instanceof LocationElement:
                return this.locations;
            default:
                return this.characters;
        }
    }

    getTypeMapByEnum(type: StoryElementEnum): Map<string, StoryElementType> {
        switch (type) {
            case StoryElementEnum.character:
                return this.characters;
            case StoryElementEnum.object:
                return this.objects;
            case StoryElementEnum.location:
                return this.locations;
        }
    }

    getTypeIterator(element: StoryElementType): Iterator<StoryElementType> {
        return this.getTypeMap(element).values();
    }

    getTypeIteratorByEnum(type: StoryElementEnum): MapIterator<StoryElementType> {
        return this.getTypeMapByEnum(type).values();
    }

    serialize(): SerializedStory {
        return {
            characters: Array.from(this.characters.values()),
            objects: Array.from(this.objects.values()),
            locations: Array.from(this.locations.values()),
            flow: this.flow
        }
    }

    static deserialize(obj: SerializedStory) {
        return new Story(obj.characters, obj.objects, obj.locations, obj.flow);
    }

    toJSON() {
        return JSON.stringify(this.serialize());
    }

    static fromJSON(json: string) {
        const obj = JSON.parse(json)
        return this.deserialize(obj);
    }
}

export default Story;
export {SerializedStory};