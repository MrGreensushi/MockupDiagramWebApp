import Procedure from "./Procedure.ts";
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
  subProcedureId: string;
  isEngActiveLanguage: boolean;
  isSubProcedureEmpty: boolean;

  constructor(
    name: string,
    subProcedureId: string,
    languages?: Languages,
    isEngActiveLanguage?: boolean,
    isSubProcedureEmpty = true
  ) {
    super(name, languages);
    this.subProcedureId = subProcedureId;
    this.isEngActiveLanguage = isEngActiveLanguage ?? true;
    this.isSubProcedureEmpty = isSubProcedureEmpty;
  }

  public get nodePhrases() {
    return this.activeLanguage.nodePhrases;
  }

  public set nodePhrases(value: Phrase[]) {
    this.nodePhrases = value;
  }

  public get details() {
    return this.activeLanguage.details;
  }

  public set details(value: string) {
    this.details = value;
  }

  public get activeLanguage() {
    return this.isEngActiveLanguage
      ? this.languages.engActivity
      : this.languages.itaActivity;
  }

  private updateActiveLanguage(lang: ActivityLanguage) {
    const newIta = this.isEngActiveLanguage ? this.languages.itaActivity : lang;
    const newEng = this.isEngActiveLanguage ? lang : this.languages.engActivity;

    return new Languages(newIta, newEng);
  }

  public cloneAndSet(
    phrases = this.nodePhrases,
    details = this.details,
    title = this.name,
    isSubProcedureEmpty = this.isSubProcedureEmpty
  ) {
    const updatedLanguage = this.activeLanguage.cloneAndSet(phrases, details);
    const updatedLanguages = this.updateActiveLanguage(updatedLanguage);
    return new Activity(
      title,
      this.subProcedureId,
      updatedLanguages,
      this.isEngActiveLanguage,
      isSubProcedureEmpty
    );
  }

  static fromJSONObject(obj: any) {
    const languages = Languages.fromJSONObject(obj.languages);
    return new Activity(
      obj.name,
      obj.subProcedureId,
      languages,
      obj.isEngActiveLanguage,
      obj.isSubProcedureEmpty
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

  public cloneAndSet(phrases: Phrase[]): ActivityLanguage;
  public cloneAndSet(details: string): ActivityLanguage;
  public cloneAndSet(phrases: Phrase[], details: string);
  public cloneAndSet(
    param1: Phrase[] | string,
    param2?: string
  ): ActivityLanguage {
    const phrases = Array.isArray(param1) ? param1 : this.nodePhrases;
    const details =
      typeof param1 === "string"
        ? param1
        : typeof param2 === "string"
        ? param2
        : this.details;
    return new ActivityLanguage(phrases, details);
  }
}

class Languages {
  itaActivity: ActivityLanguage;
  engActivity: ActivityLanguage;

  constructor(itaActivity?: ActivityLanguage, engActivity?: ActivityLanguage) {
    this.engActivity = engActivity ?? new ActivityLanguage();
    this.itaActivity = itaActivity ?? new ActivityLanguage();
  }

  static fromJSONObject(object: any) {
    try {
      const ita = object.itaActivity;
      const eng = object.engActivity;
      return new Languages(
        new ActivityLanguage(ita.nodePhrases, ita.details),
        new ActivityLanguage(eng.nodePhrases, eng.details)
      );
    } catch (ex) {
      throw new Error("Failed to parse Serialized Languages Object: " + ex);
    }
  }
}

export default Activity;
export { LevelsEnum, Phrase, ActivityDescription, ActivityLanguage, Languages };
