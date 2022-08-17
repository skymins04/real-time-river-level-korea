-- CreateTable
CREATE TABLE `APIKeys` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `api_key` VARCHAR(191) NOT NULL,
    `api_secret` VARCHAR(191) NOT NULL,
    `issue_data` DATETIME NOT NULL,

    UNIQUE INDEX `APIKeys_no_key`(`no`),
    PRIMARY KEY (`api_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
