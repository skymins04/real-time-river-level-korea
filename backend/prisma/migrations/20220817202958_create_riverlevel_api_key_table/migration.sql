-- CreateTable
CREATE TABLE `riverlevel_api_key` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `api_key` VARCHAR(191) NOT NULL,
    `api_secret` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `issue_data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `riverlevel_api_key_no_key`(`no`),
    PRIMARY KEY (`api_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
