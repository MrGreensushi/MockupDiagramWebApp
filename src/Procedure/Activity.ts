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

  public get notes() {
    return this.activeLanguage.notes;
  }

  public set notes(value: string) {
    this.notes = value;
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
    isSubProcedureEmpty = this.isSubProcedureEmpty,
    notes = this.notes
  ) {
    const updatedLanguage = this.activeLanguage.cloneAndSet(
      phrases,
      details,
      notes
    );
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

  getActivityDescription() {
    return new ActivityDescription(this.name, this.languages);
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
  ): ActivityLanguage {
    return new ActivityLanguage(phrases, details, notes);
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
        new ActivityLanguage(ita.nodePhrases, ita.details, ita.notes),
        new ActivityLanguage(eng.nodePhrases, eng.details, eng.notes)
      );
    } catch (ex) {
      throw new Error("Failed to parse Serialized Languages Object: " + ex);
    }
  }
}

export default Activity;
export { LevelsEnum, Phrase, ActivityDescription, ActivityLanguage, Languages };
