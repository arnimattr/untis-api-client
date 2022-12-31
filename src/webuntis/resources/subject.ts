/** Represents a school subject. */
export type subject = {
  /** The subject's id. Only unique per school. */
  id: number;

  /** The subject's shortened, unique name. */
  name: string;

  /** The subject's full name. */
  longName: string;

  /** @todo What does this represent? */
  alternateName: string;

  /** @todo Subjects can be inactive? */
  active: boolean;

  /** Custom RGB color for displaying this subject in the timetable, formatted as `rrggbb`. */
  foreColor?: string;

  /** Custom RGB color for displaying this subject in the timetable, formatted as `rrggbb`. */
  backColor?: string;
};
