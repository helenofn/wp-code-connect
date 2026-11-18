ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
-- Backfill existing users: email local part, sanitized, plus a short id suffix to stay unique.
UPDATE "users" SET "username" = left(lower(regexp_replace(split_part("email", '@', 1), '[^a-zA-Z0-9_.]', '', 'g')), 25) || '_' || substr("id"::text, 1, 4);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE("username");
