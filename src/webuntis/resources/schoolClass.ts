/** Represents a school class. */
export type schoolClass = {
  /** The class's id. Only unique per school. */
  id: number;

  /** The class's shortened, unique name. */
  name: string;

  /** The class's full name. */
  longName: string;

  /** @todo Classes can be inactive? */
  active: boolean;

  /** The class teacher's id. */
  teacher1?: number;

  /** Custom RGB color for displaying this subject in the timetable, formatted as `rrggbb`. */
  foreColor?: string;

  /** Custom RGB color for displaying this subject in the timetable, formatted as `rrggbb`. */
  backColor?: string;
};
