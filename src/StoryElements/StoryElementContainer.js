import StoryElementDescriptor from "./StoryElementDescriptor";

class StoryElementContainer {
    //private variables
    #baseStoryElementDescriptor;
    #id;

  constructor(storyElementDescriptor,id,description=null,notes="") {
    if (!(storyElementDescriptor instanceof StoryElementDescriptor)) {
        console.error(storyElementDescriptor, " is not a StoryElementDescriptor");
      }

    this.#baseStoryElementDescriptor = storyElementDescriptor;
    this.#id = id;
    this.description = description===null?storyElementDescriptor.description:description;
    this.notes=notes;

  }

  //getters of the private variables
  get id() {
    return this.#id;
  }

  get baseStoryElementDescriptor() {
    return this.#baseStoryElementDescriptor;
  }

  get type(){
    return this.#baseStoryElementDescriptor.type;
  }
  
  get isVariable(){
    return this.#baseStoryElementDescriptor.isVariable;
  }

}

export default StoryElementContainer;
