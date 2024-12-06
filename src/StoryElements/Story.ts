import {v4 as uuidv4} from "uuid";
import { ReactFlowJsonObject } from "@xyflow/react";
import { CharacterElement, LocationElement, ObjectElement, StoryElementEnum, StoryElementType } from "./StoryElement.ts";

type SerializedStory = {
    characters: CharacterElement[],
    objects: ObjectElement[],
    locations: LocationElement[],
    flow: ReactFlowJsonObject,
    title: string
}

class Story {
    characters: Map<string, CharacterElement>;
    objects: Map<string, ObjectElement>;
    locations: Map<string, LocationElement>;
    flow: ReactFlowJsonObject;
    title: string;

    constructor(
        characters: CharacterElement[] = [],
        objects: ObjectElement[] = [],
        locations: LocationElement[] = [],
        flow: ReactFlowJsonObject = {nodes: [], edges: [], viewport: {x: 0, y: 0, zoom: 1}},
        title?: string
    ) {
        this.characters = new Map();
        characters.forEach(char => this.characters.set(uuidv4(), char));
        this.objects = new Map();
        objects.forEach(obj => this.objects.set(uuidv4(), obj));
        this.locations = new Map();
        locations.forEach(loc => this.locations.set(uuidv4(), loc));
        this.flow = flow;
        this.title = title ?? "Storia senza titolo";
    }

    clone(): Story {
        return new Story([...this.characters.values()], [...this.objects.values()], [...this.locations.values()], this.flow, this.title); 
    }

    canAddElement(element: StoryElementType, type: StoryElementEnum): boolean {
        const map = this.getTypeMap(type);
        return ![...map.values()].some(el => el.name === element.name);
    }

    addElement(element: StoryElementType, type: StoryElementEnum) {
        if (!this.canAddElement(element, type)) return false;
        const map = this.getTypeMap(type);
        switch (type) {
            case StoryElementEnum.character:
                const char = element as CharacterElement;
                map.set(uuidv4(), new CharacterElement(char.isVariable, char.name, char.bio, char.objective, char.notes));
            break;
            case StoryElementEnum.object:
                const obj = element as ObjectElement;
                map.set(uuidv4(), new ObjectElement(obj.isVariable, obj.name, obj.use, obj.notes));
            break;
            case StoryElementEnum.location:
                const loc = element as LocationElement;
                map.set(uuidv4(), new LocationElement(loc.isVariable, loc.name, loc.purpose, loc.notes));
            break;
        }
        return true;
    }

    cloneAndAddElement(element: StoryElementType, type: StoryElementEnum): Story {
        this.addElement(element, type);
        return this.clone();
    }

    cloneAndAddFlow(flow: ReactFlowJsonObject): Story {
        this.flow = flow;
        return this.clone();
    }

    cloneAndSetElement(id: string, element: StoryElementType, type: StoryElementEnum): Story {
        this.setElement(id, element, type);
        return this.clone();
    }

    cloneAndSetTitle(title: string): Story {
        this.title = title;
        return this.clone();
    }

    cloneAndDeleteElement(id: string): Story {
        this.deleteElement(id);
        return this.clone();
    }

    setElement(id: string, element: StoryElementType, type: StoryElementEnum) {
        const iter = this.getTypeMap(type);
        iter.set(id, element);
    }

    deleteElement(id: string) {
        if (this.characters.delete(id)) return;
        if (this.objects.delete(id)) return;
        if (this.locations.delete(id)) return;
    }

    getAll(): [StoryElementType, StoryElementEnum][] {
        const entries = new Array<[StoryElementType, StoryElementEnum]>().concat(
            [...this.characters.values()].map(v => [v, StoryElementEnum.character]),
            [...this.objects.values()].map(v => [v, StoryElementEnum.object]),
            [...this.locations.values()].map(v => [v, StoryElementEnum.location]));
        return entries;
    }
  
    getTypeMap(type: StoryElementEnum): Map<string, StoryElementType> {
        switch (type) {
            case StoryElementEnum.character:
                return this.characters;
            case StoryElementEnum.object:
                return this.objects;
            case StoryElementEnum.location:
                return this.locations;
        }
    }

    getTypeIterator(type: StoryElementEnum): MapIterator<StoryElementType> {
        return this.getTypeMap(type).values();
    }

    search(element: StoryElementType, type?: StoryElementEnum) {
        let iter: Map<string, StoryElementType>;
        const ltype = type ? [type] : [StoryElementEnum.character, StoryElementEnum.object, StoryElementEnum.location];
        for (const type of ltype) {
            iter = this.getTypeMap(type);
            for (const [key, value] of iter.entries()) {
                if (value.equals(element)) return key;
            }
        }
        return null;
    }

    serialize(): SerializedStory {
        return {
            characters: Array.from(this.characters.values()),
            objects: Array.from(this.objects.values()),
            locations: Array.from(this.locations.values()),
            flow: this.flow,
            title: this.title
        }
    }

    static deserialize(obj: SerializedStory) {
        return new Story(obj.characters, obj.objects, obj.locations, obj.flow, obj.title);
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