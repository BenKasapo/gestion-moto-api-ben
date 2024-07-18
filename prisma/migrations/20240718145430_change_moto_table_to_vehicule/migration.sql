/*
  Warnings:

  - You are about to drop the `moto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `moto` DROP FOREIGN KEY `Moto_utilisateur_id_fkey`;

-- DropTable
DROP TABLE `moto`;

-- CreateTable
CREATE TABLE `Vehicule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marque` VARCHAR(191) NOT NULL,
    `modele` VARCHAR(191) NOT NULL,
    `immatriculation` VARCHAR(191) NOT NULL,
    `utilisateur_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vehicule_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehicule` ADD CONSTRAINT `Vehicule_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
