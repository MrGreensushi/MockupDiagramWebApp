import * as Blockly from 'blockly/core';

type SceneDetails = {
    title: string;
    summary: string;
    time: string;
    weather: string;
    tone: string;
    value: string;
    backgroundIds: [string[], string[], string[]];
}

type SerializedScene = {
    workspace: {[key: string]: any} | undefined;
    details: SceneDetails;
}

class Scene {
    workspace: {[key: string]: any} | undefined;
    details: SceneDetails;

    constructor(
        workspace?: Blockly.Workspace | {[key: string]: any},
        details?: Partial<SceneDetails>
    ) {
        if (workspace instanceof Blockly.Workspace)
            this.workspace = Blockly.serialization.workspaces.save(workspace);
        else
            this.workspace = workspace;
            this.details = {
                title: details?.title ?? "",
                summary: details?.summary ?? "",
                time: details?.time ?? "",
                weather: details?.weather ?? "",
                tone: details?.tone ?? "",
                value: details?.value ?? "",
                backgroundIds: details?.backgroundIds ?? [[], [], []],
            }
    }

    copy(): Scene {
        return new Scene(
            this.workspace,
            this.details
        )
    }

    serialize() {
        return {
            workspace: this.workspace,
            details: this.details
        }
    }

    static deserialize(obj: SerializedScene) {
        return new Scene(
            obj.workspace,
            obj.details
        )
    }

    toJson(): string {  //Renamed to lowercase to avoid JSON.stringify from using this
        return JSON.stringify(this.serialize());
    }

    static fromJSON(json: string) {
        try {
            const obj = JSON.parse(json)
            return this.deserialize(obj);
        } catch (ex) {
            throw new Error("Failed to parse JSON file: " + ex)
        }
    }

    static fromJSONObject(object: SerializedScene) {
        try {
            return this.deserialize(object);
        } catch (ex) {
            throw new Error("Failed to parse Serialized Scene Object: " + ex)
        }
    }

    setFromJSON(json: string, workspace: Blockly.Workspace) {
        const newScene = Scene.fromJSON(json);
        if (newScene.workspace) {
            try {
                Blockly.serialization.workspaces.load(newScene.workspace, workspace)
            } catch (ex) {
                console.error("Failed to parse JSON workspace: ", ex)
            }
        } else {
            console.info("No workspace to parse");
        }
    }

    loadToWorkspace(workspace: Blockly.Workspace) {
        if (this.workspace) Blockly.serialization.workspaces.load(this.workspace, workspace);
    }
}

export default Scene;
export {type SceneDetails, type SerializedScene};