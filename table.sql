CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50),
    password VARCHAR(255),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE (email)
);

insert into user(name ,contactNumber,email,password,status,role)values("Admin",'123','admin@gmail.com','admin','true','admin');

create table category(
id int NOT NULL AUTO_INCREMENT,
name varchar(255) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE product (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
   categoryId integer NOT NULL,
   description varchar(255),
   price integer,
   status varchar(20),
   primary key(id)
);

create table bill(
    id int not null auto_increment,
    uuid varchar(200) not null,
    name varchar(255) not null,
    email varchar(255) not null,
    contactNumber varchar(20) not null,
    total int not null,
    productDetails JSON DEFAULT NULL,
    createBy varchar(255) not null,
    primary key (id)
);
ALTER TABLE bill ADD paymentMethod varchar(50) not null;
