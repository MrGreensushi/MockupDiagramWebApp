import * as Blockly from 'blockly/core';
import {v4 as uuidv4} from "uuid";

class SceneDescription {
    id: string;
    workspace: Blockly.Workspace;
    summary: string;
    time: string;
    weather: string;
    tone: string;
    value: string
    setSummary: (summary: string) => void;
    setTime: (time: string) => void;
    setWeather: (weather: string) => void;
    setTone: (tone: string) => void;
    setValue: (value: string) => void;

    constructor(workspace: Blockly.Workspace) {
        this.id = uuidv4();
        this.workspace = workspace;
        this.summary = "";
        this.time = "";
        this.weather = "";
        this.tone = "";
        this.value = "";
        this.setSummary = () => {};
        this.setTime = () => {};
        this.setWeather = () => {};
        this.setTone = () => {};
        this.setValue = () => {};
    }

    toJSON(): string {
        const serializedObject = {
            workspace: Blockly.serialization.workspaces.save(this.workspace),
            details: {
                summary: this.summary,
                time: this.time,
                weather: this.weather,
                tone: this.tone,
                value: this.value,
            }
        }
        return JSON.stringify(serializedObject);
    }

    fromJSON(json: string) {
        try {
            const serializedObject = JSON.parse(json);
            
            this.setSummary(serializedObject.details.summary);
            this.setTime(serializedObject.details.time);
            this.setWeather(serializedObject.details.weather);
            this.setTone(serializedObject.details.tone);
            this.setValue(serializedObject.details.value);
        
            try {
                Blockly.serialization.workspaces.load(serializedObject.workspace, this.workspace)
            } catch (ex) {
                console.error("Failed to parse JSON workspace: ", ex)
            }
        } catch (ex) {
            console.error("Failed to parse JSON scene details: ", ex)
        }
    }
}

export default SceneDescription;