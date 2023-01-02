import { lesson } from "../webuntis/resources/mod.ts";
import { LessonElement } from "./LessonElement.ts";

/** Represents a collection of elements included in a lesson. */
export class LessonElementCollection {
  constructor(
    /** The elements in the collection. */
    readonly elements: {
      readonly classes: readonly LessonElement[];
      readonly teachers: readonly LessonElement[];
      readonly subjects: readonly LessonElement[];
      readonly rooms: readonly LessonElement[];
    },
  ) {}

  /** Creates a new collection from a lesson object. */
  static fromLesson(lesson: lesson): LessonElementCollection {
    return new LessonElementCollection({
      classes: lesson.kl.map(LessonElement.from),
      rooms: lesson.ro.map(LessonElement.from),
      subjects: lesson.su.map(LessonElement.from),
      teachers: lesson.te.map(LessonElement.from),
    });
  }

  /** Returns a new collection containing the elements that were originally in the lesson's schedule. */
  originalElements(): LessonElementCollection {
    let elements = { ...this.elements };

    for (let [type, typeElements] of Object.entries(elements)) {
      elements[type as keyof typeof elements] = typeElements.map((e) =>
        new LessonElement(
          e.originalId ?? e.id,
          e.originalName ?? e.name,
        )
      );
    }

    return new LessonElementCollection(elements);
  }

  /** Checks whether two collections contain the same elements. */
  equals(other: LessonElementCollection): boolean {
    for (let key in this.elements) {
      let type = key as keyof LessonElementCollection["elements"];
      if (
        this.elements[type].map((e) => e.id).sort().join() !==
          other.elements[type].map((e) => e.id).sort().join()
      ) return false;
    }
    return true;
  }
}
