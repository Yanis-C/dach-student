import { z } from "zod";

export type Subject = {
  id: string;
  name: string;
  color: string;
  icon: string;
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

export type SubjectEntity = {
  id: string;
  name: string;
  color: string;
  icon: string;
  chapters: number;
  completedChapters: number;
  createdAt?: Date;
  updatedAt?: Date;
};
