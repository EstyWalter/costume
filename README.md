# costume
please implement teh buisiness scenerio in T SQL
## Hi, I have a small home-run business selling costumes. 
Until now I've only been selling to family and friends, but I recently decided to open my business 
to the public starting January 1, 2020.
I am now going to need a database to keep track all the costumes that are sold.
I want the name of the customer, which costumes they bought, which size, how much I paid per costume, how much they paid per costume, 
how many they bought, did they pay full price, date I bought, date I sold.
I also want the total price that the customer paid.

## There are only 5 options of prices in my store. The prices go according to the size:
 Size:  Cost Price:  Price Sold:
 XS        $15           $20
 S         $17           $22
 M         $20           $25
 L         $22           $27
 XL        $25           $30
 
## So far I only sell the following costumes:
 American Girl Doll
 Artist
 Bumble Bee
 Colonial Boy
 Colonial Girl
 Elephant
 Fire Man
 Police Man
 Princess
 Zebra
 
## I am going to need the following reports:
 1. I need to know which costume is the most popular.
 2. I need to know which size is the most polpular.
 3. I need you to show me all of my customers in the following format: name: amountbought - costume customer bought (how much they paid)
 4. I need to know the profit each sale.

## Questions:
- Q: Do you need the first name of the customer?
- A: Yes, because sometimes I have 2 cusotmers with same last name.

- Q: Do you ever sell anything for less than cost price? Do you ever go on sale?
- A: No, I never sell anything for less than cost price. I don't either go on sale, but sometimes (like for family) I will give a costume for exactly cost price.

- Q: Do you ever sell something in advance (before you have it in the store)?
- A: no


## Sample Data:
CustomerName, CostumesBought, Size, AmountBought, SoldPricePerCostume, DateBought, DateSold
Chana Goldberg, Artist, XS, 2, 20, Feb 14, 2020, Apr 2, 2020
Aliza Duetch, Fire Man, L, 1, 22, Mar 9, 2021, Jan 4, 2022
Dovid Rosen, Zebra, S, 1, 22, Aug 23, 2020, Aug 25, 2020 
Shira Pent, Colonial Boy, XS, 1, 20, Sep 17, 2021, Dec 4 2021
Miriam Gruen, Princess, M, 3, 25, Jul 6, 2022, Oct 19, 2022  
Shoshana Victor, Elephant, XL, 1, 30, Nov 28, 2020, Feb 2, 2021
Mendy First, Colonial Girl, XS, 1, 20, May 24, 2021, July 17, 2021
Yisroel Horowitz, Police Man, XL, 1, 30, Jan 16, 2022, Jan 19, 2022
Aliza Duetch, American Girl Doll, S, 2, 22, Mar 12, 2021, June 21, 2021
Rochel Rubin, Bumble Bee, S, 1, 22, Sep 11, 2020, Jan 2, 2021
Bracha Ganz, Princess, M, 4, 25, Nov 3, 2020, Dec 12, 2021
Yaakov Cohen, Princess, XS, 1, 20, Dec 4, 2021, July 25, 2022
Rina Rosen, Artist, M, 1, 25, Feb 18, 2022, May 28, 2022
Rivkah Goldberger, zebra, S, 1, 22, Sep 14, 2022, Dec 29, 2022 

## T-SQL Implementation
```sql
/*
  Costume Shop database implementation + reports.
  Tested syntax: Microsoft SQL Server (T-SQL).
*/

-- 0) Database setup
IF DB_ID('CostumeShop') IS NOT NULL
BEGIN
    ALTER DATABASE CostumeShop SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CostumeShop;
END;
GO

CREATE DATABASE CostumeShop;
GO

USE CostumeShop;
GO

-- 1) Schema (single table)
IF OBJECT_ID('dbo.Sales', 'U') IS NOT NULL
    DROP TABLE dbo.Sales;
GO

CREATE TABLE dbo.Sales (
    SaleId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerFirstName NVARCHAR(50) NOT NULL,
    CustomerLastName NVARCHAR(50) NOT NULL,
    CostumeName NVARCHAR(100) NOT NULL,
    SizeCode NVARCHAR(2) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    CostPrice DECIMAL(10,2) NOT NULL,
    SoldPricePerCostume DECIMAL(10,2) NOT NULL,
    DateBought DATE NOT NULL,
    DateSold DATE NOT NULL,
    CONSTRAINT CK_Sales_DateSold CHECK (DateSold >= DateBought),
    CONSTRAINT CK_Sales_NotBlank CHECK (
        CustomerFirstName <> ''
        AND CustomerLastName <> ''
        AND CostumeName <> ''
        AND SizeCode <> ''
    ),
    CONSTRAINT CK_Sales_SizeCode CHECK (SizeCode IN ('XS', 'S', 'M', 'L', 'XL')),
    CONSTRAINT CK_Sales_SizePrice CHECK (
        (SizeCode = 'XS' AND CostPrice = 15.00 AND SoldPricePerCostume IN (15.00, 20.00)) OR
        (SizeCode = 'S'  AND CostPrice = 17.00 AND SoldPricePerCostume IN (17.00, 22.00)) OR
        (SizeCode = 'M'  AND CostPrice = 20.00 AND SoldPricePerCostume IN (20.00, 25.00)) OR
        (SizeCode = 'L'  AND CostPrice = 22.00 AND SoldPricePerCostume IN (22.00, 27.00)) OR
        (SizeCode = 'XL' AND CostPrice = 25.00 AND SoldPricePerCostume IN (25.00, 30.00))
    )
);

-- 2) Sales (sample data)
INSERT INTO dbo.Sales (
    CustomerFirstName,
    CustomerLastName,
    CostumeName,
    SizeCode,
    Quantity,
    CostPrice,
    SoldPricePerCostume,
    DateBought,
    DateSold
) VALUES
('Chana', 'Goldberg', 'Artist', 'XS', 2, 15.00, 20.00, '2020-02-14', '2020-04-02'),
('Aliza', 'Duetch', 'Fire Man', 'L', 1, 22.00, 22.00, '2021-03-09', '2022-01-04'),
('Dovid', 'Rosen', 'Zebra', 'S', 1, 17.00, 22.00, '2020-08-23', '2020-08-25'),
('Shira', 'Pent', 'Colonial Boy', 'XS', 1, 15.00, 20.00, '2021-09-17', '2021-12-04'),
('Miriam', 'Gruen', 'Princess', 'M', 3, 20.00, 25.00, '2022-07-06', '2022-10-19'),
('Shoshana', 'Victor', 'Elephant', 'XL', 1, 25.00, 30.00, '2020-11-28', '2021-02-02'),
('Mendy', 'First', 'Colonial Girl', 'XS', 1, 15.00, 20.00, '2021-05-24', '2021-07-17'),
('Yisroel', 'Horowitz', 'Police Man', 'XL', 1, 25.00, 30.00, '2022-01-16', '2022-01-19'),
('Aliza', 'Duetch', 'American Girl Doll', 'S', 2, 17.00, 22.00, '2021-03-12', '2021-06-21'),
('Rochel', 'Rubin', 'Bumble Bee', 'S', 1, 17.00, 22.00, '2020-09-11', '2021-01-02'),
('Bracha', 'Ganz', 'Princess', 'M', 4, 20.00, 25.00, '2020-11-03', '2021-12-12'),
('Yaakov', 'Cohen', 'Princess', 'XS', 1, 15.00, 20.00, '2021-12-04', '2022-07-25'),
('Rina', 'Rosen', 'Artist', 'M', 1, 20.00, 25.00, '2022-02-18', '2022-05-28'),
('Rivkah', 'Goldberger', 'Zebra', 'S', 1, 17.00, 22.00, '2022-09-14', '2022-12-29');

-- 5) Reports
-- 5.1 Most popular costume (by total quantity sold)
SELECT TOP (1)
    sa.CostumeName,
    SUM(sa.Quantity) AS TotalUnitsSold
FROM dbo.Sales sa
GROUP BY sa.CostumeName
ORDER BY SUM(sa.Quantity) DESC, sa.CostumeName ASC;

-- 5.2 Most popular size (by total quantity sold)
SELECT TOP (1)
    sa.SizeCode,
    SUM(sa.Quantity) AS TotalUnitsSold
FROM dbo.Sales sa
GROUP BY sa.SizeCode
ORDER BY SUM(sa.Quantity) DESC, sa.SizeCode ASC;

-- 5.3 Customers formatted: name: amountbought - costume (total paid)
SELECT
    CONCAT(sa.CustomerFirstName, ' ', sa.CustomerLastName, ': ', sa.Quantity, ' - ', sa.CostumeName,
           ' (', FORMAT(sa.Quantity * sa.SoldPricePerCostume, 'C'), ')') AS CustomerSummary
FROM dbo.Sales sa
ORDER BY sa.CustomerLastName, sa.CustomerFirstName, sa.CostumeName;

-- 5.4 Profit per sale (total sale profit)
SELECT
    sa.SaleId,
    CONCAT(sa.CustomerFirstName, ' ', sa.CustomerLastName) AS CustomerName,
    sa.CostumeName,
    sa.SizeCode,
    sa.Quantity,
    sa.SoldPricePerCostume,
    sa.CostPrice,
    sa.Quantity * sa.SoldPricePerCostume AS TotalPaid,
    sa.Quantity * (sa.SoldPricePerCostume - sa.CostPrice) AS Profit
FROM dbo.Sales sa
ORDER BY sa.SaleId;
```
