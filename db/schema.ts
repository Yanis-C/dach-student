import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";


// ===== Subjects =====
export const subjects = sqliteTable("subjects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    icon: text("icon").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
    chapters: many(chapters),
    exams: many(examsToSubjects),
}))


// ===== Chapters =====

export const chapters = sqliteTable("chapters", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    subjectId: integer("subject_id")
      .references(() => subjects.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
});

export const chaptersRelations = relations(chapters, ({ one }) => ({
    subject: one(subjects, {
        fields: [chapters.subjectId],
        references: [subjects.id],
    }),
}));


// ===== Exams =====

export const exams = sqliteTable("exams", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
});

export const examsRelations = relations(exams, ({ many }) => ({
    subjects: many(examsToSubjects),
}));

// ===== Events =====

export const events = sqliteTable("events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    time: text("time"),
    description: text("description"),
    subjectId: integer("subject_id")
        .references(() => subjects.id),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .$onUpdate(() => new Date()),
});

export const eventsRelations = relations(events, ({ one }) => ({
    subject: one(subjects, {
        fields: [events.subjectId],
        references: [subjects.id],
    }),
}));


// ===== Junction tables =====

export const examsToSubjects = sqliteTable("exams_to_subjects", {
    examId: integer("exam_id").notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    coefficient: integer("coefficient").default(1),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
}, (table) => [
    primaryKey({ columns: [table.examId, table.subjectId] }),
]);

export const examsToSubjectsRelations = relations(examsToSubjects, ({ one }) => ({
    exam: one(exams, {
        fields: [examsToSubjects.examId],
        references: [exams.id],
    }),
    subject: one(subjects, {
        fields: [examsToSubjects.subjectId],
        references: [subjects.id],
    }),
}));


export type Subject = typeof subjects.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type Event = typeof events.$inferSelect;