import { config } from "dotenv";
import { hash, compare } from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import path from "path";

// Load .env.local từ thư mục gốc project (khi chạy npx tsx database/seed-user.ts).
// override: true để giá trị trong .env.local luôn được dùng, kể cả khi shell/IDE đã set ADMIN_PASSWORD, v.v.
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, casing: "snake_case" });

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME;
  const universityIdStr = process.env.ADMIN_UNIVERSITY_ID;
  const universityCard = process.env.ADMIN_UNIVERSITY_CARD;

  if (!email || !password || !fullName || !universityIdStr || !universityCard) {
    console.error("Missing required env vars for seed:user");
    console.error(
      "Required: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME, ADMIN_UNIVERSITY_ID, ADMIN_UNIVERSITY_CARD"
    );
    process.exit(1);
  }

  const universityId = parseInt(universityIdStr, 10);
  if (isNaN(universityId)) {
    console.error("ADMIN_UNIVERSITY_ID must be a number");
    process.exit(1);
  }

  // Trim để tránh khoảng trắng/newline từ .env khiến compare trong auth fail
  const plainPassword = password.trim();
  const hashedPassword = await hash(plainPassword, 10);

  // Bước 1: Xác minh hash trong memory — compare(plain, hashed) phải true
  const verifyInMemory = await compare(plainPassword, hashedPassword);
  if (!verifyInMemory) {
    console.error("Seed error: bcrypt compare(plain, hashed) failed in memory. Check bcryptjs.");
    process.exit(1);
  }
  console.log("OK: Hash verified in memory (compare(plain, hashed) = true)");

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existing.id));

    // Bước 2: Đọc lại từ DB và xác minh hash đã lưu đúng
    const [afterUpdate] = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, existing.id))
      .limit(1);

    if (!afterUpdate) {
      console.error("Seed error: Could not read user back after update.");
      process.exit(1);
    }

    const storedHash = String(afterUpdate.password);
    const verifyInDb = await compare(plainPassword, storedHash);
    if (!verifyInDb) {
      console.error("Seed error: After update, compare(plain, storedHash) failed.");
      console.error("Stored hash length:", storedHash.length, "starts with:", storedHash.slice(0, 10));
      process.exit(1);
    }
    console.log("OK: Stored password verified (compare(plain, stored) = true)");
    console.log(`Admin already exists: password updated for ${email}`);
    console.log("You can now sign in with ADMIN_PASSWORD from .env.local (exact value, no extra spaces).");
    return;
  }

  await db.insert(users).values({
    fullName,
    email,
    universityId,
    password: hashedPassword,
    universityCard,
    status: "APPROVED",
    role: "ADMIN",
  });

  // Xác minh sau insert: đọc lại và compare
  const [afterInsert] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (afterInsert) {
    const verifyInsert = await compare(plainPassword, String(afterInsert.password));
    if (!verifyInsert) {
      console.error("Seed error: After insert, compare(plain, stored) failed.");
      process.exit(1);
    }
    console.log("OK: Stored password verified after insert.");
  }

  console.log(`Admin user created: ${email}`);
  console.log("You can now sign in with these credentials.");
};

const GUEST_PLACEHOLDER_CARD = "/ids/admin-placeholder.png";

const seedGuest = async () => {
  const email = process.env.GUEST_EMAIL;
  const password = process.env.GUEST_PASSWORD;

  if (!email || !password) {
    console.log("GUEST_EMAIL / GUEST_PASSWORD not set — skipping guest user seed.");
    return;
  }

  const plainPassword = password.trim();
  const hashedPassword = await hash(plainPassword, 10);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existing.id));
    console.log(`Guest user already exists: password updated for ${email}`);
    return;
  }

  await db.insert(users).values({
    fullName: "Guest User",
    email,
    universityId: 999999,
    password: hashedPassword,
    universityCard: GUEST_PLACEHOLDER_CARD,
    status: "APPROVED",
    role: "USER",
  });

  console.log(`Guest user created: ${email}`);
};

const main = async () => {
  await seedAdmin();
  await seedGuest();
};

main().catch(console.error);
