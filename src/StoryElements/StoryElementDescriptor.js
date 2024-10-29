class StoryElementDescriptor {
  constructor(isVariable, type,description = "") {
    this.type = type;
    this.isVariable = isVariable;
    this.description = description;
  }

  static checkIfSame(a, b) {
    return (
      a.type === b.type &&
      a.isVariable === b.isVariable &&
      a.description === b.description
    );
  }
}

export default StoryElementDescriptor;
