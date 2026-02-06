import { z } from "zod";

// Legacy type (for reference)
export interface ExamData {
  title: string;
  dueDate: string;
  creationDate: string;
}

// Exam form types
export const examChapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  selected: z.boolean(),
});

export const examSubjectSchema = z.object({
  id: z.string(),
  chapters: z.array(examChapterSchema),
  coefficient: z.number().min(1, "Le coefficient doit être au moins 1"),
});

export const examSchema = z.object({
  name: z.string().min(1, "Le nom de l'examen est requis"),
  date: z.date({ message: "La date de l'examen est requise" }),
  subjects: z.array(examSubjectSchema),
});

export type ExamFormData = z.infer<typeof examSchema>;

export type ExamEntity = {
  id: string;
  name: string;
  date: Date;
  subjects: {
    id: string;
    chapters: { id: string; name: string; selected: boolean }[];
    coefficient: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};
