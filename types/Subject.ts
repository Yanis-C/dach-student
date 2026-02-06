import { z } from "zod";
import type { Subject as DbSubject } from "@/db/schema";

// Re-export DB type as base Subject
export type Subject = DbSubject;

// For UI display with computed chapter counts
export type SubjectWithChapters = Subject & {
  chapters: number;
  completedChapters: number;
};

// Subject form types
export const subjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Le nom de la matière est requis." })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères." }),
  color: z.string().min(1),
  icon: z.string().min(1),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
