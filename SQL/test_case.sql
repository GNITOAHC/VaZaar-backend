insert into User (Mail, Id, Sex, Name, Password, Nick_name, Model_id)
values ('example@example.com', 1, 'M', 'John Doe', 'password123', 'JD', 1234567890);

insert into Company (Id, Name, Location, Mail, Password)
values (1, 'Company 1', 'Location 1', 'company1@example.com', 'company123'),
	(2, 'Company 2', 'Location 2', 'company2@example.com', 'company234');

insert into Items (Serial, Name, Price, Amount, Company_Id)
values (1, 'Item 1', 10, 5, 1);

insert into Cart (User_Mail, Serial, Shipping, Payment, Destination, Time, Memo)
values ('example@example.com', 1, 'Standard', 'Credit Card', 'Address 1', CURRENT_TIMESTAMP, 'Memo memo 1'),
	('example@example.com', 2, 'Standard', 'Credit Card', 'Address 10', CURRENT_TIMESTAMP, 'Memo memo 2');

insert into Branch (Company_Id, Branch_name, Location)
values (1, 'Branch 1', 'Location 1.1');

insert into User_Follow_Company (User_Mail, Company_Id)
values ('example@example.com', 1),
	('example@example.com', 2);
    
insert into User_Favorite_Company (User_Mail, Items_Serial)
VALUES ('example@example.com', 1);
