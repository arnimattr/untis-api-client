/** Represents a teacher. */
export type teacher = {
  /** The teacher's id. Only unique per school. */
  id: number;

  /** The teacher's shortened, unique name. */
  name: string;

  /** The teacher's first name. */
  foreName: string;

  /** The teacher's last name. */
  longName: string;

  /** The teacher's title. */
  title: string;

  /** @todo Teachers can be inactive? */
  active: boolean;

  /** @todo What does this do? */
  dids: { id: number }[];
};
