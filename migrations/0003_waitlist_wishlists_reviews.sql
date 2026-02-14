CREATE TABLE IF NOT EXISTS "waitlist" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "book_id" uuid NOT NULL REFERENCES "books"("id"),
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_user_book_unique" ON "waitlist" ("user_id", "book_id");

CREATE TABLE IF NOT EXISTS "wishlists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "book_id" uuid NOT NULL REFERENCES "books"("id"),
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_user_book_unique" ON "wishlists" ("user_id", "book_id");

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "book_id" uuid NOT NULL REFERENCES "books"("id"),
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp with time zone DEFAULT now()
);
