import * as Blockly from 'blockly/core';

class SceneDescription {
    constructor(workspace) {
        this.workspace = workspace;
        this.summary = ""
        this.setSummary = () => {}
        this.time = ""
        this.setTime = () => {}
        this.weather = ""
        this.setWeather = () => {}
        this.tone = ""
        this.setTone = () => {}
        this.value = ""
        this.setValue = () => {}
    }

    toJSON() {
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

    fromJSON(json) {
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