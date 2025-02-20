enum LevelsEnum {
  novice = "Novice",
  intermediate = "Intermediate",
  expert = "Expert",
}

class ActivityDescription {
  name: string;
  content: ActivityContent;

  constructor(name: string, content?: ActivityContent) {
    this.name = name;
    this.content = content ?? new ActivityContent();
  }
}

class Activity extends ActivityDescription {
  subProcedureId: string;

  constructor(name: string, subProcedureId: string, content?: ActivityContent) {
    super(name, content);
    this.subProcedureId = subProcedureId;
  }

  public get nodePhrases() {
    return this.content.nodePhrases;
  }

  public set nodePhrases(value: Phrase[]) {
    this.nodePhrases = value;
  }

  public get details() {
    return this.content.details;
  }

  public set details(value: string) {
    this.details = value;
  }

  public get notes() {
    return this.content.notes;
  }

  public set notes(value: string) {
    this.notes = value;
  }

  public cloneAndSet(
    phrases = this.nodePhrases,
    details = this.details,
    title = this.name,
    notes = this.notes
  ) {
    const updatedContent = this.content.cloneAndSet(phrases, details, notes);
    return new Activity(title, this.subProcedureId, updatedContent);
  }

  static fromJSONObject(obj: any) {
    const contentOBJ = obj.content;
    const content = new ActivityContent(
      contentOBJ.nodePhrases,
      contentOBJ.details,
      contentOBJ.notes
    );
    return new Activity(obj.name, obj.subProcedureId, content);
  }

  getActivityDescription() {
    return new ActivityDescription(this.name, this.content);
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

class ActivityContent {
  nodePhrases: Phrase[];
  details: string;
  notes: string;

  constructor(nodePhrases?: Phrase[], details?: string, notes?: string) {
    this.nodePhrases = nodePhrases ?? [
      new Phrase(undefined, LevelsEnum.novice, ""),
      new Phrase(undefined, LevelsEnum.intermediate, ""),
      new Phrase(undefined, LevelsEnum.expert, ""),
    ];
    this.details = details ?? "";
    this.notes = notes ?? "";
  }

  public cloneAndSet(
    phrases = this.nodePhrases,
    details = this.details,
    notes = this.notes
  ): ActivityContent {
    return new ActivityContent(phrases, details, notes);
  }
}

export default Activity;
export { LevelsEnum, Phrase, ActivityDescription, ActivityContent };
