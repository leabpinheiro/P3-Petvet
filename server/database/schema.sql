CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(85) NOT NULL,
  lastname VARCHAR(85) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  city VARCHAR(85),
  phone VARCHAR(30),
  role ENUM('owner','veterinary') NOT NULL,
  order_nb INT NULL
);

CREATE TABLE pet (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  tattoo_nb VARCHAR(10) NULL,
  chip_nb BIGINT(15) NULL,
  born_at DATETIME NOT NULL,
  gender ENUM('m','f'),
  specie ENUM('chien','chat','lapin'),
  breed VARCHAR(100) NOT NULL,
  is_neutered BOOLEAN DEFAULT FALSE,
  photo TEXT DEFAULT NULL,
  weight FLOAT(10) DEFAULT NULL
);

CREATE TABLE pet_user (
  pet_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (pet_id, user_id),
  FOREIGN KEY (pet_id) REFERENCES pet(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE reminder (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  programmed_at DATETIME NOT NULL,
  content VARCHAR(100) NOT NULL,
  dosage VARCHAR(30) DEFAULT NULL,
  frequency ENUM('jour', 'semaine', 'mois', 'an') DEFAULT NULL,
  frequency_count INT DEFAULT 1,
  pet_id INT NOT NULL,
  user_id INT NOT NULL
);

CREATE TABLE consultation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  report TEXT NOT NULL,
  treatment TEXT DEFAULT NULL,
  dosage TEXT DEFAULT NULL,
  category ENUM('vaccination', 'urgence', 'suivi', 'opération', 'médicale'),
  pet_id INT NOT NULL,
  user_id INT NOT NULL
);
