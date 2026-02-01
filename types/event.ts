export type Event = {
  key: string;
  color: string;
  title: string;
  type?: "exam" | "study" | "other";
};

export type EventsData = {
  [date: string]: Event[];
};
