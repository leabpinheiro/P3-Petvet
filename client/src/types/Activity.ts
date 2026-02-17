export type Activity = {
  id: number;
  title: string;
  petName: string;
  date: string | number;
  type: "consultation" | "reminder";
};
