import NarrativeDataManager from "./NarrativeDataManager";
import SceneDescription from "./SceneDescription";

class StoryDescription {
    dataManager: NarrativeDataManager;
    scenes: SceneDescription[];

    constructor() {
        this.dataManager = NarrativeDataManager.getInstance();
        this.scenes = [];
    }

    getSceneById(id: string): SceneDescription | undefined {
        return this.scenes.find(scene => scene.id === id);
    }

    addScene(scene: SceneDescription) {
        this.scenes.push(scene);
    }
}