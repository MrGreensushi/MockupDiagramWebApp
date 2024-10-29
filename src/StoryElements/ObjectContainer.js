import StoryElementContainer from "./StoryElementContainer";

class ObjectContainer extends StoryElementContainer{
    constructor(storyElementDescriptor,id, notes = "") {
        super(storyElementDescriptor,id,notes)
    }

}
export default ObjectContainer;