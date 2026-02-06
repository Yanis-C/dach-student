CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`date` integer NOT NULL,
	`time` text,
	`description` text,
	`subject_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`date` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `exams_to_subjects` (
	`exam_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`coefficient` integer DEFAULT 1,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`exam_id`, `subject_id`),
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `chapters` ADD `subject_id` integer REFERENCES subjects(id);--> statement-breakpoint
ALTER TABLE `chapters` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `chapters` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `subjects` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `subjects` ADD `updated_at` integer;