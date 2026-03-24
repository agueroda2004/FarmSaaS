/*
  Warnings:

  - You are about to alter the column `role` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `role` ENUM('Administrator', 'User', 'Veterinarian', 'Owner') NOT NULL DEFAULT 'User';
