import StoryElement from "./StoryElement";

class CharacterData extends StoryElement {
  constructor(isVariable, type,id,bio, objective) {
    super(isVariable, type,id);
    this.bio = bio;
    this.objective = objective;
  }
}

export default CharacterData;