import StoryElementContainer from "./StoryElementContainer";

class CharacterContainer extends StoryElementContainer {
  constructor(storyElementDescriptor, id, notes = "") {
    super(storyElementDescriptor, id, notes);
  }
}

export default CharacterContainer;
