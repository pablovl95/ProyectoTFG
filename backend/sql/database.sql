DROP TABLE IF EXISTS Reviews;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS Products;

DROP TABLE IF EXISTS Categories;

DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Shops;

DROP TABLE IF EXISTS Addresses;

DROP TABLE IF EXISTS ProductsOrders;

DROP TABLE IF EXISTS ProductImages;

CREATE TABLE
  Categories (
    CategoryID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    CategoryName TEXT NOT NULL,
    CategoryDescription TEXT
  );

CREATE TABLE
  Shops (
    ShopID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ShopName TEXT NOT NULL,
    AddressID TEXT NOT NULL,
    ShopDescription TEXT,
    OpeningHours TEXT,
    Phone TEXT,
    Email TEXT,
    TotalSales INTEGER DEFAULT 0,
    FOREIGN KEY (AddressID) REFERENCES Addresses (AddressID)
  );

CREATE TABLE
  Users (
    UserID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    ProfileImageUrl TEXT DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    Phone TEXT,
    UserType TEXT CHECK (
      UserType IN (
        'delivery',
        'producer',
        'consumer',
        'administrator'
      )
    ) NOT NULL,
    AssociatedStoreID TEXT,
    AccountStatus TEXT CHECK (AccountStatus IN ('active', 'inactive')) NOT NULL,
    FOREIGN KEY (AssociatedStoreID) REFERENCES Shops (ShopID)
  );

CREATE TABLE
  Products (
    ProductID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductName TEXT NOT NULL,
    ProductDescription TEXT,
    PrincipalCategoryID TEXT NOT NULL,
    SecundaryCategoryID TEXT,
    Price REAL,
    Rating REAL CHECK (Rating BETWEEN 0 AND 5),
    StockAvailability INTEGER,
    TotalSales INTEGER DEFAULT 0,
    TotalComments INTEGER DEFAULT 0,
    ImageDefaultID TEXT,
    ShopID TEXT NOT NULL,
    FOREIGN KEY (PrincipalCategoryID) REFERENCES Categories (CategoryID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

CREATE TABLE
  Reviews (
    ReviewID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductID TEXT NOT NULL,
    Comment TEXT,
    UserID TEXT NOT NULL,
    AssignedRating INTEGER CHECK (AssignedRating BETWEEN 1 AND 5),
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID),
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );

CREATE TABLE
  Addresses (
    AddressID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    AddressType TEXT NOT NULL,
    UserID TEXT NOT NULL,
    StreetAddress TEXT NOT NULL,
    StreetNumber TEXT,
    FLOOR TEXT,
    Staircase TEXT,
    City TEXT NOT NULL,
    State TEXT NOT NULL,
    PostalCode TEXT NOT NULL,
    Country TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );

CREATE TABLE
  Orders (
    OrderID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    UserID TEXT NOT NULL,
    OrderDate TEXT NOT NULL,
    TotalPrice REAL NOT NULL,
    Status TEXT CHECK (
      Status IN (
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      )
    ) NOT NULL,
    Summary TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );

CREATE TABLE
  ProductsOrders (
    ProductsOrderID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    UserID TEXT NOT NULL,
    ShopID TEXT NOT NULL,
    Products TEXT NOT NULL,
    TotalPrice REAL NOT NULL,
    Status TEXT CHECK (
      Status IN (
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      )
    ) NOT NULL,
    Summary TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

CREATE TABLE 
ProductImages (
  ImageID TEXT PRIMARY KEY DEFAULT (
    LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
    SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
  ),
  ProductID TEXT NOT NULL,
  ImageContent TEXT NOT NULL,
  Caption TEXT,
  UploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
);


