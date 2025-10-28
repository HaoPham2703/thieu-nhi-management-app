CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255),
  "full_name" varchar(255),
  "created_at" timestamptz,
  "updated_at" timestamptz
);

CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE
);

CREATE TABLE "user_roles" (
  "user_id" uuid,
  "role_id" uuid,
  PRIMARY KEY ("user_id", "role_id")
);

CREATE TABLE "teachers" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "phone" varchar(30)
);

CREATE TABLE "students" (
  "id" uuid PRIMARY KEY,
  "first_name" varchar(100),
  "last_name" varchar(100),
  "date_of_birth" date,
  "baptized" boolean,
  "parent_contact" varchar(100),
  "created_at" timestamptz
);

CREATE TABLE "classes" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100),
  "grade" int,
  "school_year" varchar(20)
);

CREATE TABLE "class_teachers" (
  "class_id" uuid,
  "teacher_id" uuid,
  PRIMARY KEY ("class_id", "teacher_id")
);

CREATE TABLE "enrollments" (
  "id" uuid PRIMARY KEY,
  "class_id" uuid,
  "student_id" uuid,
  "enrolled_at" timestamptz
);

CREATE TABLE "attendance" (
  "id" uuid PRIMARY KEY,
  "class_id" uuid,
  "student_id" uuid,
  "date" date,
  "status" varchar(20),
  "conduct_note" varchar(255),
  "created_by" uuid
);

COMMENT ON COLUMN "roles"."name" IS 'ADMIN, GLV, PRIEST';

COMMENT ON COLUMN "classes"."school_year" IS 'VD: 2025-2026';

COMMENT ON COLUMN "attendance"."status" IS 'PRESENT, ABSENT, LATE';

ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "teachers" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "class_teachers" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "class_teachers" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

ALTER TABLE "enrollments" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "enrollments" ADD FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "attendance" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "attendance" ADD FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "attendance" ADD FOREIGN KEY ("created_by") REFERENCES "teachers" ("id");
