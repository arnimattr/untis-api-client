// deno-lint-ignore no-unused-vars
import { teacher } from "./teacher.ts";

/** Represents a room. */
export type room = {
  /** The room's id. Only unique per school. */
  id: number;

  /** The room's shortened, unique name. */
  name: string;

  /** The room's full name. */
  longName: string;

  /** @todo Rooms can be inactive? */
  active: boolean;

  /** The building the room is in. */
  building: string;

  /** @todo What does this do? Maybe related to {@link teacher.dids}? */
  did?: number;

  /** Custom RGB color for displaying this room in the timetable, formatted as `rrggbb`. */
  foreColor?: string;

  /** Custom RGB color for displaying this room in the timetable, formatted as `rrggbb`. */
  backColor?: string;
};
