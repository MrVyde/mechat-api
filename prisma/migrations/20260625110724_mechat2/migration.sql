/*
  Warnings:

  - Added the required column `emoji` to the `MessageReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mechat_api"."MessageReaction" ADD COLUMN     "emoji" TEXT NOT NULL;
