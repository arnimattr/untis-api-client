export type teacher = {
  id: number;
  name: string;
  foreName: string;
  longName: string;
  title: string;
  active: boolean;
  dids: { id: number }[];
};
