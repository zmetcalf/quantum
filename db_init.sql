DROP TABLE IF EXISTS `session`;

CREATE TABLE session (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(255) DEFAULT NULL,
  `user_first_name` VARCHAR(255) DEFAULT NULL,
  `user_last_name` VARCHAR(255) DEFAULT NULL,
  `screen_width` INT(11) DEFAULT NULL,
  `screen_height` INT(11) DEFAULT NULL,
  `visits` INT(11) DEFAULT NULL,
  `page_response` TEXT DEFAULT NULL,
  `domain` VARCHAR(255) DEFAULT NULL,
  `path` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
