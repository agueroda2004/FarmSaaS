/*
  Warnings:

  - A unique constraint covering the columns `[user_id,farm_id]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_user_id_farm_id_key` ON `Employee`(`user_id`, `farm_id`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
