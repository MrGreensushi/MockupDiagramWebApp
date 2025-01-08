import SubProcedure from "./SubProcedure";

enum LevelsEnum {
  novice = "Novice",
  intermediate = "Intermediate",
  expert = "Expert",
}

class Activity {
  name: string;
  nodePhrases: Phrase[];
  subProcedure: SubProcedure;

  constructor(
    name: string,
    subProcedure: SubProcedure,
    nodePhrases?: Phrase[]
  ) {
    this.name = name;
    this.nodePhrases = nodePhrases ?? [
      new Phrase(undefined, LevelsEnum.novice, ""),
      new Phrase(undefined, LevelsEnum.intermediate, ""),
      new Phrase(undefined, LevelsEnum.expert, ""),
    ];
    this.subProcedure = subProcedure;
  }

  copy(): Activity {
    return new Activity(this.name, this.subProcedure, [...this.nodePhrases]);
  }

  static deserialize(obj: any) {
    return new Activity(obj.name, obj.subProcedure, obj.nodePhrases);
  }

  static fromJSON(json: string) {
    try {
      const obj = JSON.parse(json);
      return this.deserialize(obj);
    } catch (ex) {
      throw new Error("Failed to parse JSON file: " + ex);
    }
  }

  static fromJSONObject(object: any) {
    try {
      return this.deserialize(object);
    } catch (ex) {
      throw new Error("Failed to parse Serialized Activity Object: " + ex);
    }
  }
}

class Phrase {
  clipId: string;
  level: LevelsEnum;
  text: string;

  constructor(clipId: string = "Description", level: LevelsEnum, text: string) {
    this.clipId = clipId;
    this.level = level;
    this.text = text;
  }
}

class ActivityDescription {
  name: string;
  nodePhrases: Phrase[];

  constructor(name: string, nodePhrases?: Phrase[]) {
    this.name = name;
    this.nodePhrases = nodePhrases ?? [
      new Phrase(undefined, LevelsEnum.novice, ""),
      new Phrase(undefined, LevelsEnum.intermediate, ""),
      new Phrase(undefined, LevelsEnum.expert, ""),
    ];
  }
}

export default Activity;
export { LevelsEnum, Phrase, ActivityDescription };
