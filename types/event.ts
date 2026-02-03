export type Event = {
  key: string;
  color: string;
  title: string;
  description?: string;
  hours?: string;
  type?: "exam" | "study" | "other";
};

export type EventsData = {
  [date: string]: Event[];
};
