-- CreateTable
CREATE TABLE `Association` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `programme_label` VARCHAR(191) NULL,

    UNIQUE INDEX `Association_id_key`(`id`),
    UNIQUE INDEX `Association_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cotisation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `devise` VARCHAR(191) NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL,
    `association_label` VARCHAR(191) NOT NULL,
    `type_cotisation_label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cotisation_id_key`(`id`),
    UNIQUE INDEX `Cotisation_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_envoi` DATETIME(3) NULL,
    `association_label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Notification_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `devise` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cotisation_label` VARCHAR(191) NOT NULL,
    `utilisateur_id` VARCHAR(191) NOT NULL,
    `periode_id` INTEGER NOT NULL,

    UNIQUE INDEX `Paiement_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `id_cotisation` INTEGER NOT NULL,

    UNIQUE INDEX `Periode_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Permission_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profil_Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Profil_Utilisateur_id_key`(`id`),
    UNIQUE INDEX `Profil_Utilisateur_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Programme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `portee` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Programme_id_key`(`id`),
    UNIQUE INDEX `Programme_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Succursale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `association_id` INTEGER NOT NULL,

    UNIQUE INDEX `Succursale_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type_Cotisation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Type_Cotisation_id_key`(`id`),
    UNIQUE INDEX `Type_Cotisation_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `postnom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone1` VARCHAR(191) NOT NULL,
    `phone2` VARCHAR(191) NULL,
    `lieu_naissance` VARCHAR(191) NOT NULL,
    `date_naissance` DATE NOT NULL,
    `association_label` VARCHAR(191) NULL,
    `profil_label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToProfil_Utilisateur` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToProfil_Utilisateur_AB_unique`(`A`, `B`),
    INDEX `_PermissionToProfil_Utilisateur_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Association` ADD CONSTRAINT `Association_programme_label_fkey` FOREIGN KEY (`programme_label`) REFERENCES `Programme`(`nom`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cotisation` ADD CONSTRAINT `Cotisation_association_label_fkey` FOREIGN KEY (`association_label`) REFERENCES `Association`(`nom`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cotisation` ADD CONSTRAINT `Cotisation_type_cotisation_label_fkey` FOREIGN KEY (`type_cotisation_label`) REFERENCES `Type_Cotisation`(`label`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicule` ADD CONSTRAINT `Vehicule_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_association_label_fkey` FOREIGN KEY (`association_label`) REFERENCES `Association`(`nom`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_cotisation_label_fkey` FOREIGN KEY (`cotisation_label`) REFERENCES `Cotisation`(`label`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `Periode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Periode` ADD CONSTRAINT `Periode_id_cotisation_fkey` FOREIGN KEY (`id_cotisation`) REFERENCES `Cotisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Succursale` ADD CONSTRAINT `Succursale_association_id_fkey` FOREIGN KEY (`association_id`) REFERENCES `Association`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_association_label_fkey` FOREIGN KEY (`association_label`) REFERENCES `Association`(`nom`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_profil_label_fkey` FOREIGN KEY (`profil_label`) REFERENCES `Profil_Utilisateur`(`label`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToProfil_Utilisateur` ADD CONSTRAINT `_PermissionToProfil_Utilisateur_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToProfil_Utilisateur` ADD CONSTRAINT `_PermissionToProfil_Utilisateur_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profil_Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
