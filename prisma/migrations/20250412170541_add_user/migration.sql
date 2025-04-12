-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "RefreshToken" TEXT,
    "RefreshTokenExpiryTime" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);
