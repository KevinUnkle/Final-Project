set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
CREATE TABLE "public"."users" (
	"username" serial NOT NULL,
	"userId" serial NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" timestamptz(6) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."workouts" (
	"workoutNotes" TEXT NOT NULL,
	"userId" integer NOT NULL,
	"workoutId" serial NOT NULL,
	"muscleGroup" TEXT NOT NULL,
	"workoutDate" DATE NOT NULL,
	"createdAt" timestamptz(6) NOT NULL,
	CONSTRAINT "workouts_pk" PRIMARY KEY ("workoutId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "public"."workouts" ADD CONSTRAINT "workouts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
