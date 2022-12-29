import { ElementType } from "webuntis/resources";

export const method = "authenticate";

export type params = {
  user: string;
  password: string;
  client?: string;
};

export type result = {
  sessionId: string;
  personType: ElementType.Student | ElementType.Teacher;
  personId: number;
  klasseId: number;
};
