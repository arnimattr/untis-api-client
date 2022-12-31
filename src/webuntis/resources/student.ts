/** Represents a student. */
export type student = {
  /** The student's id. Only unique per school. */
  id: number;

  /** @todo What does this do? */
  key: string;

  /** The student's shortened, unique name. */
  name: string;

  /** The student's first name. */
  foreName: string;

  /** The student's last name. */
  longName: string;

  /** The student's gender. */
  gender: string;
};
