import SubProcedure from "./SubProcedure.ts";

enum LevelsEnum {
  novice = "Novice",
  intermediate = "Intermediate",
  expert = "Expert",
}

class ActivityDescription {
  name: string;
  languages: Languages;

  constructor(name: string, languages?: Languages) {
    this.name = name;
    this.languages = languages ?? new Languages();
  }
}

class Activity extends ActivityDescription {
  subProcedure: SubProcedure;
  isEngActiveLanguage: boolean;

  constructor(
    name: string,
    subProcedure: SubProcedure,
    languages?: Languages,
    isEngActiveLanguage?: boolean
  ) {
    super(name, languages);
    this.subProcedure = subProcedure;
    this.isEngActiveLanguage = isEngActiveLanguage ?? true;
  }

  public get nodePhrases() {
    return this.activeLanguage.nodePhrases;
  }

  public set nodePhrases(value: Phrase[]) {
    this.nodePhrases = value;
  }

  public get activeLanguage() {
    return this.isEngActiveLanguage
      ? this.languages.engActivity
      : this.languages.itaActivity;
  }

  private updateActiveLanguage(lang: ActivityLanguage) {
    const newIta = this.isEngActiveLanguage ? this.languages.itaActivity : lang;
    const newEng = this.isEngActiveLanguage ? lang : this.languages.engActivity;

    this.languages = new Languages(newIta, newEng);
  }

  public cloneAndSetPhrases(phrases: Phrase[], name?: string) {
    const lang = this.activeLanguage.cloneAndSetPhrases(phrases);
    this.updateActiveLanguage(lang);

    return new Activity(
      name ?? this.name,
      this.subProcedure,
      this.languages,
      this.isEngActiveLanguage
    );
  }

  static deserialize(
    obj: any,
    parent: SubProcedure,
    callbacksActivity: any,
    callbacksEvent: any
  ) {
    const subProcedure = SubProcedure.fromJSONObject(
      obj.subProcedure,
      parent,
      callbacksActivity,
      callbacksEvent
    );

    return new Activity(
      obj.name,
      subProcedure,
      obj.languages,
      obj.isEngActiveLanguage
    );
  }

  // static fromJSON(json: string) {
  //   try {
  //     const obj = JSON.parse(json);
  //     return this.deserialize(obj);
  //   } catch (ex) {
  //     throw new Error("Failed to parse JSON file: " + ex);
  //   }
  // }

  static fromJSONObject(
    object: any,
    parent: SubProcedure,
    callbacksActivity: any,
    callbacksEvent: any
  ) {
    try {
      return this.deserialize(
        object,
        parent,
        callbacksActivity,
        callbacksEvent
      );
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

class ActivityLanguage {
  nodePhrases: Phrase[];
  details: string;

  constructor(nodePhrases?: Phrase[], details?: string) {
    this.nodePhrases = nodePhrases ?? [
      new Phrase(undefined, LevelsEnum.novice, ""),
      new Phrase(undefined, LevelsEnum.intermediate, ""),
      new Phrase(undefined, LevelsEnum.expert, ""),
    ];
    this.details = details ?? "";
  }

  public cloneAndSetPhrases(phrases: Phrase[]) {
    return new ActivityLanguage(phrases, this.details);
  }
}

class Languages {
  itaActivity: ActivityLanguage;
  engActivity: ActivityLanguage;

  constructor(itaActivity?: ActivityLanguage, engActivity?: ActivityLanguage) {
    this.engActivity = engActivity ?? new ActivityLanguage();
    this.itaActivity = itaActivity ?? new ActivityLanguage();
  }
}

export default Activity;
export { LevelsEnum, Phrase, ActivityDescription, ActivityLanguage, Languages };
