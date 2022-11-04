import { ElementType } from "../resources/index.js";

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
