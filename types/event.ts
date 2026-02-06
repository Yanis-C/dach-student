import { z } from "zod";

// Calendar event types
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

// Event form types
export const eventSchema = z.object({
  type: z.enum(["activity", "revision"]),
  title: z
    .string()
    .min(1, { message: "Le titre de l'événement est requis." })
    .max(100, { message: "Le titre ne peut pas dépasser 100 caractères." }),
  subjectId: z.string().optional(),
  date: z.date({ message: "La date est requise." }),
  time: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

export type EventEntity = {
  id: string;
  type: "activity" | "revision";
  title: string;
  subjectId?: string;
  date: Date;
  time?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
