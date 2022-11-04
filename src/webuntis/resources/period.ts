export type period = {
  id: number;
  date: number;
  startTime: number;
  endTime: number;
  lstype?: "ls" | "oh" | "sb" | "bs" | "ex";
  code?: "" | "cancelled" | "irregular";
  lsnumber: number;
  lstext: string;
  substText?: string;
  activityType: "Unterricht" | "Bereitschaft";
  sg?: string;
  kl: element[];
  te: element[];
  su: element[];
  ro: element[];
};

export type element = {
  id: number;
  name: string;
  longname: string;

  /**
   * If this is not `undefined`, this is the id of the original element and
   * `element.id` is its substitution.
   */
  orgid?: number;
  orgname?: string;
};
