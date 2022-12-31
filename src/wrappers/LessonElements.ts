import { lesson } from "../webuntis/resources/lesson.ts";
import { LessonElement } from "./LessonElement.ts";

export class LessonElements {
  constructor(
    readonly elements: {
      readonly classes: readonly LessonElement[];
      readonly teachers: readonly LessonElement[];
      readonly subjects: readonly LessonElement[];
      readonly rooms: readonly LessonElement[];
    },
  ) {}

  static fromLesson(lesson: lesson): LessonElements {
    return new LessonElements({
      classes: lesson.kl.map(LessonElement.from),
      rooms: lesson.ro.map(LessonElement.from),
      subjects: lesson.su.map(LessonElement.from),
      teachers: lesson.te.map(LessonElement.from),
    });
  }

  originalElements(): LessonElements {
    let elements = { ...this.elements };

    for (let [type, typeElements] of Object.entries(elements)) {
      elements[type as keyof typeof elements] = typeElements.map((e) =>
        new LessonElement(
          e.originalId ?? e.id,
          e.originalName ?? e.name,
        )
      );
    }

    return new LessonElements(elements);
  }

  equals(other: LessonElements): boolean {
    for (let key in this.elements) {
      let type = key as keyof LessonElements["elements"];
      if (
        this.elements[type].map((e) => e.id).sort().join() !==
          other.elements[type].map((e) => e.id).sort().join()
      ) return false;
    }
    return true;
  }
}
