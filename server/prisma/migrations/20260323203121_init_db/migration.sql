-- CreateTable
CREATE TABLE `Farm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `owner` VARCHAR(100) NULL,
    `registration_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` ENUM('Operator', 'Veterinarian', 'Manager') NOT NULL DEFAULT 'Operator',
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('Gestation', 'Farrowing', 'Nursery', 'Fattening', 'Quarantine', 'Hospital') NOT NULL,
    `capacity` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `observation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Race` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `race_id` INTEGER NOT NULL,
    `tag_number` VARCHAR(50) NOT NULL,
    `type` ENUM('Sow', 'Boar') NOT NULL,
    `entry_date` DATE NOT NULL,
    `born_date` DATE NULL,
    `parity` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `location_id` INTEGER NULL,
    `observation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RemovalReason` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimalRemoval` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `farm_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `type` ENUM('Dead', 'Disposal', 'Sacrificed') NOT NULL,
    `reason_id` INTEGER NOT NULL,
    `observation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `sow_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `location_id` INTEGER NULL,
    `expected_farrowing_date` DATE NULL,
    `status` ENUM('Pending', 'Pregnant', 'Failed', 'Aborted', 'Farrowed') NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER NOT NULL,
    `farm_id` INTEGER NOT NULL,
    `boar_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `shift` ENUM('Morning', 'Afternoon', 'Night') NOT NULL,
    `type` ENUM('Artificial', 'Natural') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Abortion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `service_id` INTEGER NOT NULL,
    `reason_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `shift` ENUM('Morning', 'Afternoon', 'Night') NOT NULL,
    `observation` TEXT NULL,

    UNIQUE INDEX `Abortion_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Farrowing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `service_id` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NULL,
    `live_males` INTEGER NOT NULL DEFAULT 0,
    `live_females` INTEGER NOT NULL DEFAULT 0,
    `stillborn` INTEGER NOT NULL DEFAULT 0,
    `mummified` INTEGER NOT NULL DEFAULT 0,
    `total_weight_kg` DECIMAL(6, 2) NOT NULL,
    `manual_intervention` BOOLEAN NOT NULL DEFAULT false,
    `observation` TEXT NULL,

    UNIQUE INDEX `Farrowing_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FarrowingMedication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farrowing_id` INTEGER NOT NULL,
    `medicine_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `dose` DECIMAL(6, 2) NOT NULL,
    `time_applied` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FarrowingEmployee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farrowing_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `participation_type` ENUM('Primary', 'Assistant', 'Relief') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Litter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `farrowing_id` INTEGER NOT NULL,
    `current_piglets` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('Nursing', 'Weaned') NOT NULL DEFAULT 'Nursing',

    UNIQUE INDEX `Litter_farrowing_id_key`(`farrowing_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PigletDeathReason` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LitterMovement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `litter_id` INTEGER NOT NULL,
    `related_litter_id` INTEGER NULL,
    `type` ENUM('Adoption', 'Donation', 'Death', 'PartialWeaning', 'FullWeaning') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `weight_kg` DECIMAL(6, 2) NULL,
    `destination_batch_id` INTEGER NULL,
    `date` DATETIME(3) NOT NULL,
    `reason_id` INTEGER NULL,
    `employee_id` INTEGER NOT NULL,
    `observation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Batch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `identifier` VARCHAR(50) NOT NULL,
    `start_date` DATE NOT NULL,
    `current_head_count` INTEGER NOT NULL DEFAULT 0,
    `estimated_average_weight` DECIMAL(6, 2) NULL,
    `status` ENUM('Active', 'Sold', 'Merged') NOT NULL DEFAULT 'Active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatchLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `location_id` INTEGER NOT NULL,
    `current_head_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatchMovement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `location_id` INTEGER NULL,
    `type` ENUM('Entry', 'Death', 'Sale', 'Transfer') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_weight_kg` DECIMAL(8, 2) NULL,
    `date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(255) NULL,
    `employee_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedPhase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `feed_phase_id` INTEGER NOT NULL,
    `stock_kg` DECIMAL(10, 2) NOT NULL,
    `minimum_stock_kg` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatchFeeding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `feed_phase_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `quantity_kg` DECIMAL(8, 2) NOT NULL,
    `date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalTreatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `medicine_id` INTEGER NOT NULL,
    `animal_id` INTEGER NULL,
    `batch_id` INTEGER NULL,
    `litter_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `employee_id` INTEGER NOT NULL,
    `dose` DECIMAL(6, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `observation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `farm_id` INTEGER NOT NULL,
    `batch_id` INTEGER NULL,
    `animal_id` INTEGER NULL,
    `client_name` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_weight_kg` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL,
    `date` DATE NOT NULL,
    `invoice_number` VARCHAR(50) NULL,
    `employee_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_race_id_fkey` FOREIGN KEY (`race_id`) REFERENCES `Race`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RemovalReason` ADD CONSTRAINT `RemovalReason_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimalRemoval` ADD CONSTRAINT `AnimalRemoval_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimalRemoval` ADD CONSTRAINT `AnimalRemoval_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimalRemoval` ADD CONSTRAINT `AnimalRemoval_reason_id_fkey` FOREIGN KEY (`reason_id`) REFERENCES `RemovalReason`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_sow_id_fkey` FOREIGN KEY (`sow_id`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mating` ADD CONSTRAINT `Mating_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mating` ADD CONSTRAINT `Mating_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mating` ADD CONSTRAINT `Mating_boar_id_fkey` FOREIGN KEY (`boar_id`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mating` ADD CONSTRAINT `Mating_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Abortion` ADD CONSTRAINT `Abortion_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Abortion` ADD CONSTRAINT `Abortion_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Abortion` ADD CONSTRAINT `Abortion_reason_id_fkey` FOREIGN KEY (`reason_id`) REFERENCES `RemovalReason`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Abortion` ADD CONSTRAINT `Abortion_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Farrowing` ADD CONSTRAINT `Farrowing_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Farrowing` ADD CONSTRAINT `Farrowing_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Farrowing` ADD CONSTRAINT `Farrowing_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarrowingMedication` ADD CONSTRAINT `FarrowingMedication_farrowing_id_fkey` FOREIGN KEY (`farrowing_id`) REFERENCES `Farrowing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarrowingMedication` ADD CONSTRAINT `FarrowingMedication_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `Medicine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarrowingMedication` ADD CONSTRAINT `FarrowingMedication_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarrowingEmployee` ADD CONSTRAINT `FarrowingEmployee_farrowing_id_fkey` FOREIGN KEY (`farrowing_id`) REFERENCES `Farrowing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FarrowingEmployee` ADD CONSTRAINT `FarrowingEmployee_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Litter` ADD CONSTRAINT `Litter_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Litter` ADD CONSTRAINT `Litter_farrowing_id_fkey` FOREIGN KEY (`farrowing_id`) REFERENCES `Farrowing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PigletDeathReason` ADD CONSTRAINT `PigletDeathReason_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_litter_id_fkey` FOREIGN KEY (`litter_id`) REFERENCES `Litter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_related_litter_id_fkey` FOREIGN KEY (`related_litter_id`) REFERENCES `Litter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_destination_batch_id_fkey` FOREIGN KEY (`destination_batch_id`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_reason_id_fkey` FOREIGN KEY (`reason_id`) REFERENCES `PigletDeathReason`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LitterMovement` ADD CONSTRAINT `LitterMovement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchLocation` ADD CONSTRAINT `BatchLocation_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchLocation` ADD CONSTRAINT `BatchLocation_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchLocation` ADD CONSTRAINT `BatchLocation_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchMovement` ADD CONSTRAINT `BatchMovement_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchMovement` ADD CONSTRAINT `BatchMovement_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchMovement` ADD CONSTRAINT `BatchMovement_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchMovement` ADD CONSTRAINT `BatchMovement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedPhase` ADD CONSTRAINT `FeedPhase_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedInventory` ADD CONSTRAINT `FeedInventory_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedInventory` ADD CONSTRAINT `FeedInventory_feed_phase_id_fkey` FOREIGN KEY (`feed_phase_id`) REFERENCES `FeedPhase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchFeeding` ADD CONSTRAINT `BatchFeeding_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchFeeding` ADD CONSTRAINT `BatchFeeding_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchFeeding` ADD CONSTRAINT `BatchFeeding_feed_phase_id_fkey` FOREIGN KEY (`feed_phase_id`) REFERENCES `FeedPhase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchFeeding` ADD CONSTRAINT `BatchFeeding_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `Medicine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `Animal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_litter_id_fkey` FOREIGN KEY (`litter_id`) REFERENCES `Litter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalTreatment` ADD CONSTRAINT `MedicalTreatment_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_farm_id_fkey` FOREIGN KEY (`farm_id`) REFERENCES `Farm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `Animal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
