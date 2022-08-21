/*
  Warnings:

  - You are about to drop the `riverlevel_api_key` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `riverlevel_api_key`;

-- CreateTable
CREATE TABLE `riverlevel_api_key_tb` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `api_key` VARCHAR(191) NOT NULL,
    `api_secret` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `issue_data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `riverlevel_api_key_tb_no_key`(`no`),
    PRIMARY KEY (`api_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riverlevel_gauge_tb` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `obscd` VARCHAR(191) NOT NULL,
    `obsnm` VARCHAR(191) NOT NULL,
    `mngorg` VARCHAR(191) NOT NULL,
    `flood_warning` ENUM('N', 'Y') NOT NULL DEFAULT 'N',
    `addr` VARCHAR(191) NULL,
    `lon` VARCHAR(191) NULL,
    `lat` VARCHAR(191) NULL,
    `gdt` DOUBLE NULL,
    `planflood_level` DOUBLE NULL,

    UNIQUE INDEX `riverlevel_gauge_tb_no_key`(`no`),
    PRIMARY KEY (`obscd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riverlevel_water_level_tb` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `obscd` VARCHAR(191) NOT NULL,
    `water_level` DOUBLE NOT NULL,
    `obsdate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `riverlevel_water_level_tb_no_key`(`no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `riverlevel_water_level_tb` ADD CONSTRAINT `riverlevel_water_level_tb_obscd_fkey` FOREIGN KEY (`obscd`) REFERENCES `riverlevel_gauge_tb`(`obscd`) ON DELETE RESTRICT ON UPDATE CASCADE;
