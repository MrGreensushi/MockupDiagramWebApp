import * as Blockly from 'blockly/core';
import {v4 as uuidv4} from "uuid";
import { workspaceConfiguration } from '../Blockly/BlocklyConfiguration';

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

    constructor(
        workspace: Blockly.Workspace,
        summary?: string,
        time?: string,
        weather?: string,
        tone?: string,
        value?: string,
        setSummary?: (summary: string) => void,
        setTime?: (time: string) => void,
        setWeather?: (weather: string) => void,
        setTone?: (tone: string) => void,
        setValue?: (value: string) => void
    ) {
        this.id = uuidv4();
        this.workspace = workspace;
        this.summary = summary ?? "";
        this.time = time ?? "";
        this.weather = weather ?? "";
        this.tone = tone ?? "";
        this.value = value ?? "";
        this.setSummary = setSummary ?? ((summary: string) => this.summary = summary);
        this.setTime = setTime ?? ((time: string) => this.time = time);
        this.setWeather = setWeather ?? ((weather: string) => this.weather = weather);
        this.setTone = setTone ?? ((tone: string) => this.tone = tone);
        this.setValue = setValue ?? ((value: string) => this.value = value);
    }

    toJSON(): string {
        const serializedObject = {
            workspace: this.workspace ? Blockly.serialization.workspaces.save(this.workspace) : {},
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

    setFromJSON(json: string, sd: SceneDescription = this): void {
        try {
            const serializedObject = JSON.parse(json);
            
            sd.setSummary(serializedObject.details.summary);
            sd.setTime(serializedObject.details.time);
            sd.setWeather(serializedObject.details.weather);
            sd.setTone(serializedObject.details.tone);
            sd.setValue(serializedObject.details.value);
        
            try {
                Blockly.serialization.workspaces.load(serializedObject.workspace, sd.workspace)
            } catch (ex) {
                console.error("Failed to parse JSON workspace: ", ex)
            }
        } catch (ex) {
            console.error("Failed to parse JSON scene details: ", ex)
        }
    }
}

export default SceneDescription;