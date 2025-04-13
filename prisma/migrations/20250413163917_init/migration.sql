-- CreateTable
CREATE TABLE "users" (
    "Id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshToken" TEXT,
    "refreshTokenExpiryTime" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("Id")
);
