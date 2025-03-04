import {v4 as uuidv4} from "uuid";
import { Node, ReactFlowJsonObject } from "@xyflow/react";
import { CharacterElement, LocationElement, ObjectElement, StoryElementType, StoryElement } from "./StoryElement.ts";
import Scene from "./Scene.ts";
import { ChoiceDetails } from "../Flow/StoryNode.tsx";

type SerializedStory = {
    characters: [string, CharacterElement][],
    objects: [string, ObjectElement][],
    locations: [string, LocationElement][],
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
        characters: CharacterElement[] | [string, CharacterElement][] = [],
        objects: ObjectElement[] | [string, ObjectElement][] = [],
        locations: LocationElement[] | [string, LocationElement][] = [],
        flow: ReactFlowJsonObject = {nodes: [], edges: [], viewport: {x: 0, y: 0, zoom: 1}},
        title?: string
    ) {
        this.characters = new Map();
        characters.forEach(char => Array.isArray(char) ? this.characters.set(char[0], char[1]) : this.characters.set(uuidv4(), char));
        this.objects = new Map();
        objects.forEach(obj => Array.isArray(obj) ? this.objects.set(obj[0], obj[1]) : this.objects.set(uuidv4(), obj));
        this.locations = new Map();
        locations.forEach(loc => Array.isArray(loc) ? this.locations.set(loc[0], loc[1]) : this.locations.set(uuidv4(), loc));
        this.flow = flow;
        this.title = title ?? "Storia senza titolo";
    }

    clone(): Story {
        return new Story([...this.characters.entries()], [...this.objects.entries()], [...this.locations.entries()], this.flow, this.title); 
    }

    canAddElement(element: StoryElement): boolean {
        const map = this.getTypeMap(element.type);
        return ![...map.values()].some(el => el.name === element.name);
    }

    addElement(element: StoryElement) {
        if (!this.canAddElement(element)) return false;
        const map = this.getTypeMap(element.type);
        switch (element.type) {
            case StoryElementType.character:
                const char = element as CharacterElement;
                map.set(uuidv4(), new CharacterElement(char.isVariable, char.name, char.bio, char.objective, char.notes));
            break;
            case StoryElementType.object:
                const obj = element as ObjectElement;
                map.set(uuidv4(), new ObjectElement(obj.isVariable, obj.name, obj.use, obj.notes));
            break;
            case StoryElementType.location:
                const loc = element as LocationElement;
                map.set(uuidv4(), new LocationElement(loc.isVariable, loc.name, loc.purpose, loc.notes));
            break;
        }
        return true;
    }

    cloneAndAddElement(element: StoryElement): Story {
        this.addElement(element);
        return this.clone();
    }

    cloneAndAddFlow(flow: ReactFlowJsonObject): Story {
        this.flow = flow;
        return this.clone();
    }

    cloneAndSetScene(id: string, scene: Scene) {
        this.flow.nodes.find(node => node.id === id)!.data.scene = scene;
        return this.clone();
    }

    cloneAndSetChoice(id: string, choices: ChoiceDetails[]) {
        this.flow.nodes.find(node => node.id === id)!.data.choices = choices;
        return this.clone();
    }

    cloneAndSetElement(id: string, element: StoryElement): Story {
        this.setElement(id, element);
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

    setElement(id: string, element: StoryElement) {
        const iter = this.getTypeMap(element.type);
        iter.set(id, element);
    }

    deleteElement(id: string) {
        if (this.characters.delete(id)) return;
        if (this.objects.delete(id)) return;
        if (this.locations.delete(id)) return;
    }

    getAll(): StoryElement[] {
        return new Array<StoryElement>().concat(
            [...this.characters.values()],
            [...this.objects.values()],
            [...this.locations.values()]);
    }

    getAllMap(): Map<string, StoryElement> {
        return new Map(new Array<[string, StoryElement]>().concat(
            [...this.getTypeMap(StoryElementType.character)],
            [...this.getTypeMap(StoryElementType.object)],
            [...this.getTypeMap(StoryElementType.location)]));
    }
  
    getTypeMap(type: StoryElementType): Map<string, StoryElement> {
        switch (type) {
            case StoryElementType.character:
                return this.characters;
            case StoryElementType.object:
                return this.objects;
            case StoryElementType.location:
                return this.locations;
        }
    }

    getTypeIterator(type: StoryElementType): MapIterator<StoryElement> {
        return this.getTypeMap(type).values();
    }

    getElementById(id: string): StoryElement | undefined {
        return this.characters.get(id) ?? this.objects.get(id) ?? this.locations.get(id);
    }

    getNodeById(id: string): Node | undefined {
        return this.flow.nodes.find(node => node.id === id);
    }

    find(element: StoryElement) {
        const iter = this.getTypeMap(element.type);
        for (const [key, value] of iter.entries()) {
            if (value.equals(element)) return key;
        }
        return null;
    }

    serialize(): SerializedStory {
        return {
            characters: Array.from(this.characters.entries()),
            objects: Array.from(this.objects.entries()),
            locations: Array.from(this.locations.entries()),
            flow: this.flow,
            title: this.title
        }
    }

    static deserialize(obj: SerializedStory): Story {
        return new Story(obj.characters, obj.objects, obj.locations, obj.flow, obj.title);
    }

    toJSON(): string {
        return JSON.stringify(this.serialize());
    }

    static fromJSON(json: string): Story {
        const obj = JSON.parse(json)
        return this.deserialize(obj);
    }

    instantiate(): Story {
        const instance = this.clone();
        for (const char of this.characters) {
            if (char[1].isVariable) {
                instance.characters[char[0]] = new CharacterElement(false, char[1].name + " (Istanziato)");
            }
        }
        for (const obj of this.objects) {
            if (obj[1].isVariable) {
                instance.objects[obj[0]] = new ObjectElement(false, obj[1].name + " (Istanziato)");
            }
        }
        for (const loc of this.locations) {
            if (loc[1].isVariable) {
                instance.locations[loc[0]] = new LocationElement(false, loc[1].name + " (Istanziato)");
            }
        }
        return instance;
    }
}

export default Story;
export {SerializedStory};