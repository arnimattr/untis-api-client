import {
  formatUntisDate,
  formatUntisTime,
  testDate,
  testTime,
} from "#lib/timeformat/index.js";
import { element, period } from "#webuntis/resources/index.js";

type lessonType =
  | "lesson"
  | "officeHour"
  | "standby"
  | "breakSupervision"
  | "exam";

type lessonCode = "regular" | "cancelled" | "irregular";

type activityType = "Unterricht" | "Bereitschaft";

/**
 * Wrapper around the period objects returned by the WebUntis API.
 */
export class Period {
  /**
   * Elements that are associated with this period, grouped by their type.
   * Each list is sorted by the element ids.
   */
  readonly elements: {
    readonly classes: readonly PeriodElement[];
    readonly teachers: readonly PeriodElement[];
    readonly subjects: readonly PeriodElement[];
    readonly rooms: readonly PeriodElement[];
  };

  constructor(
    /**
     * The lesson's id.
     */
    readonly id: number,

    /**
     * Type of the lesson.
     */
    readonly lessonType: lessonType,

    /**
     * Code that contains whether the lesson is regular, irregular or cancelled.
     */
    readonly lessonCode: lessonCode,

    /**
     * Lesson number. Unique per student group.
     */
    readonly lessonNumber: number,

    /**
     * Lesson text.
     */
    readonly lessonText: string,

    /**
     * Describes a substitution if present.
     */
    readonly substitutionText: string | null,

    /**
     * Activity type of the lesson.
     */
    readonly activityType: activityType,

    /**
     * Student group for this lesson.
     */
    readonly studentGroup: string | null,

    elements: {
      classes: PeriodElement[];
      teachers: PeriodElement[];
      subjects: PeriodElement[];
      rooms: PeriodElement[];
    },

    /**
     * Date of the lesson, formatted as `yyyy-mm-dd`.
     */
    private date: string,

    /**
     * Start time of the lesson, formatted as `hh:mm`.
     */
    private startTime: string,

    /**
     * End time of the lesson, formatted as `hh:mm`.
     */
    private endTime: string
  ) {
    testDate(date);
    testTime(startTime);
    testTime(endTime);

    // Sort elements by id
    for (let e of Object.values(elements)) {
      e.sort((a, b) => a.id - b.id);
    }
    this.elements = elements;
  }

  /**
   * Return's the lesson's date as a string, formatted as `yyyy-mm-dd`.
   * @returns the date
   */
  getDateAsString = () => this.date;

  /**
   * Parses the lesson's date into a JS {@link Date} object.
   * @returns the date object
   */
  getDateAsObject = () => new Date(this.date);

  /**
   * Return's the lesson's start time as a string, formatted as `hh:mm`.
   * @returns the start time
   */
  getStartTimeAsString = () => this.startTime;

  /**
   * Combines the lesson's date and start time into a date time, formatted as `yyyy-mm-ddThh:mm`.
   * @returns the date time
   */
  getStartDateTimeAsString = () => `${this.date}T${this.startTime}`;

  /**
   * Combines the lesson's date and start time into a date time and parses it into a {@link Date} object.
   * @returns the date object
   */
  getStartDateTimeAsObject = () => new Date(this.getStartDateTimeAsString());

  /**
   * Return's the lesson's end time as a string, formatted as `hh:mm`.
   * @returns the end time
   */
  getEndTimeAsString = () => this.endTime;

  /**
   * Combines the lesson's date and end time into a date time, formatted as `yyyy-mm-ddThh:mm`.
   * @returns the date time
   */
  getEndDateTimeAsString = () => `${this.date}T${this.endTime}`;

  /**
   * Combines the lesson's date and end time into a date time and parses it into a {@link Date} object.
   * @returns the date object
   */
  getEndDateTimeAsObject = () => new Date(this.getEndDateTimeAsString());

  /**
   * Creates a new instance of this class.
   * @param school the period returned by WebUntis.
   * @returns the new instance
   */
  static from(period: period) {
    return new Period(
      period.id,
      period.lstype === "bs"
        ? "breakSupervision"
        : period.lstype === "ex"
        ? "exam"
        : period.lstype === "oh"
        ? "officeHour"
        : period.lstype === "sb"
        ? "standby"
        : "lesson",
      period.code === "cancelled"
        ? "cancelled"
        : period.code === "irregular"
        ? "irregular"
        : "regular",
      period.lsnumber,
      period.lstext,
      period.substText || null,
      period.activityType,
      period.sg || null,
      {
        classes: period.kl.map(PeriodElement.from),
        rooms: period.ro.map(PeriodElement.from),
        subjects: period.su.map(PeriodElement.from),
        teachers: period.te.map(PeriodElement.from),
      },
      formatUntisDate(period.date),
      formatUntisTime(period.startTime),
      formatUntisTime(period.endTime)
    );
  }
}

/**
 * Wrapper around an element included in a {@link Period}.
 */
export class PeriodElement {
  constructor(
    /**
     * Id of the element.
     */
    readonly id: number,

    /**
     * Short name of the element.
     */
    readonly name: string,

    /**
     * Longer name of the element.
     */
    readonly longName: string
  ) {}

  /**
   * Returns whether the element is substituted.
   * @returns whether the element is substituted
   */
  isSubstituted = () => this instanceof SubstitutedPeriodElement;

  /**
   * Creates a new instance of this class.
   * @param element the element returned by WebUntis.
   * @returns an instance of either {@link PeriodElement} or {@link SubstitutedPeriodElement}
   */
  static from(element: element) {
    return element.orgid && element.orgname
      ? new SubstitutedPeriodElement(
          element.id,
          element.name,
          element.longname,
          element.orgid,
          element.orgname
        )
      : new PeriodElement(element.id, element.name, element.longname);
  }
}

/**
 * Wrapper around a substituted element included in a {@link Period}.
 */
export class SubstitutedPeriodElement extends PeriodElement {
  constructor(
    id: number,
    name: string,
    longName: string,
    readonly originalId: number,
    readonly originalName: string
  ) {
    super(id, name, longName);
  }
}
