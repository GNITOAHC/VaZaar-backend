drop database if exists `VaZaar`;
create database `VaZaar`;
use VaZaar;

create table User (
    Mail varchar(30) not null,
    Id int not null unique,
    Sex char,
    Name varchar(20) not null,
    Password varchar(100) not null,
    Nick_name varchar(20) not null,
    Model_id bigint not null,
    primary key (Mail)
);

create table Items (
    Serial bigint not null,
    Name varchar(20) not null,
    Price int not null,
    Amount int not null,
    Company_Id bigint not null,
    primary key (Serial)
);

create table Company (
    Id bigint not null,
    Name varchar(20) not null,
    Location varchar(50) not null unique,
    Mail varchar(30),
    Password varchar(100),
    User_Mail varchar(30),
    primary key (Id),
    foreign key (User_Mail) references User(Mail)
);

alter table Items
add foreign key (Company_Id) references Company(Id);

create table Cart (
    User_Mail varchar(30) not null,
    Serial bigint not null unique,
    Shipping varchar(20) not null,
    Payment varchar(20) not null,
    Destination varchar(50) not null,
    Time timestamp,
    Memo text,
    primary key (User_Mail, Serial),
    foreign key (User_Mail) references User(Mail)
);

create table Branch (
    Company_Id bigint not null,
    Branch_name varchar(20) not null,
    Location varchar(50) not null unique,
    primary key (Company_Id, Branch_name),
    foreign key (Company_Id) references Company(Id)
);

create table User_Follow_Company (
    User_Mail varchar(30) not null,
    Company_Id bigint not null,
    primary key (User_Mail, Company_Id),
    foreign key (User_Mail) references User(Mail),
    foreign key (Company_Id) references Company(Id)
);

create table User_Favorite_Company (
    User_Mail varchar(30) not null,
    Items_Serial bigint not null,
    primary key (User_Mail, Items_Serial),
    foreign key (User_Mail) references User(Mail),
    foreign key (Items_Serial) references Items(Serial)
);

create table Cart_Has_Items (
    Cart_User_Mail varchar(30) not null,
    Cart_Serial bigint not null,
    Items_Serial bigint not null,
    primary key (Cart_User_Mail, Cart_Serial, Items_Serial),
    foreign key (Items_Serial) references Items(Serial),
    foreign key (Cart_Serial) references Cart(Serial),
    foreign key (Items_Serial) references Items(Serial)
);
