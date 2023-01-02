import { lessonElement } from "../webuntis/resources/mod.ts";

/** Wrapper around an element included in a {@link Lesson}. */
export class LessonElement {
  /** Only exists on {@link SubstitutedLessonElement}. */
  readonly originalId?: number;

  /** Only exists on {@link SubstitutedLessonElement}. */
  readonly originalName?: string;

  constructor(
    /** Id of the element. */
    readonly id: number,
    /** Short name of the element. */
    readonly name: string,
  ) {}

  /**
   * Creates a new instance of this class.
   * @param element the element returned by WebUntis.
   * @returns an instance of either {@link LessonElement} or {@link SubstitutedLessonElement}
   */
  static from(
    element: lessonElement,
  ): LessonElement | SubstitutedLessonElement {
    return element.orgid && element.orgname
      ? new SubstitutedLessonElement(
        element.id,
        element.name,
        element.orgid,
        element.orgname,
      )
      : new LessonElement(element.id, element.name);
  }

  /** Whether the element is substituted. */
  isSubstituted(): boolean {
    return this instanceof SubstitutedLessonElement;
  }
}

/** Wrapper around a substituted element included in a {@link Lesson}. */
export class SubstitutedLessonElement extends LessonElement {
  constructor(
    id: number,
    name: string,
    /** Id of the original element. */
    readonly originalId: number,
    /** Short name of the original element. */
    readonly originalName: string,
  ) {
    super(id, name);
  }
}
