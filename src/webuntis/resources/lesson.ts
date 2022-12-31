export type lesson = {
  id: number;
  date: number;
  startTime: number;
  endTime: number;
  lstype?: "ls" | "oh" | "sb" | "bs" | "ex";
  code?: "" | "cancelled" | "irregular";
  lsnumber: number;
  lstext: string;
  substText?: string;
  activityType: string;
  sg?: string;
  kl: lessonElement[];
  te: lessonElement[];
  su: lessonElement[];
  ro: lessonElement[];
};

export type lessonElement = {
  id: number;
  name: string;

  /**
   * If this is not `undefined`, this is the id of the original element and
   * `element.id` is its substitution.
   */
  orgid?: number;
  orgname?: string;
};
