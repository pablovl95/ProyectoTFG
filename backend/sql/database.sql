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

CREATE TABLE Reviews (
    ReviewID TEXT PRIMARY KEY DEFAULT (
        LOWER(HEX(RANDOMBLOB(4))) || 
        LOWER(HEX(RANDOMBLOB(2))) || 
        SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
        SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || 
        SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
        LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductID TEXT NOT NULL,
    Comment TEXT,
    UserID TEXT NOT NULL,
    AssignedRating INTEGER CHECK (AssignedRating BETWEEN 1 AND 5),
    ContainsPhotos BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID),
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
);
CREATE TABLE Review_Images (
    ImageID TEXT PRIMARY KEY DEFAULT (
        LOWER(HEX(RANDOMBLOB(4))) || 
        LOWER(HEX(RANDOMBLOB(2))) || 
        SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
        SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || 
        SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
        LOWER(HEX(RANDOMBLOB(6)))
    ),
    ReviewID TEXT NOT NULL,
    ImagePath TEXT NOT NULL,
    FOREIGN KEY (ReviewID) REFERENCES Reviews (ReviewID)
);


CREATE TABLE
  Addresses (
    AddressID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    UserID TEXT NOT NULL,
    AddressTitle TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Phone TEXT NOT NULL,
    AddressLine TEXT NOT NULL,
    AdressNumber TEXT NOT NULL,
    PostalCode TEXT NOT NULL,
    Country TEXT NOT NULL,
    Province TEXT NOT NULL,
    City TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );


CREATE TABLE 
ProductImages (
  ImageID TEXT PRIMARY KEY DEFAULT (
    LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
    SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
  ),
  ProductID TEXT NOT NULL,
  ImageContent TEXT NOT NULL,
  UploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
);

CREATE TABLE Orders (
  OrderID TEXT PRIMARY KEY DEFAULT (
    LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || 
    SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
  ),
  UserID TEXT NOT NULL,
  ShopID TEXT NOT NULL,
  AddressID TEXT NOT NULL,
  OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  OrderStatus TEXT CHECK (OrderStatus IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) NOT NULL DEFAULT 'pending',
  CarrierID TEXT DEFAULT NULL,
  FOREIGN KEY (UserID) REFERENCES Users (UserID),
  FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
);

CREATE TABLE OrderProducts (
  OrderID TEXT NOT NULL,
  ProductID TEXT NOT NULL,
  Quantity INTEGER NOT NULL CHECK (Quantity > 0),
  PRIMARY KEY (OrderID, ProductID),
  FOREIGN KEY (OrderID) REFERENCES Orders (OrderID),
  FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
);

CREATE TABLE Product_Info (
    ProductID INTEGER PRIMARY KEY,
    Dimensions TEXT,
    Weight REAL,
    Volume REAL,
    Unit TEXT,
    Units INTEGER,
    Price_per_unit REAL,
    Manufacturer TEXT,
    Brand TEXT,
    Storage_instructions TEXT,
    Country_of_origin_ingredients TEXT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Nutritional_Info (
    ProductID INTEGER PRIMARY KEY,
    Calories INTEGER,
    Total_fat REAL,
    Saturated_fat REAL,
    Trans_fat REAL,
    Cholesterol REAL,
    Sodium REAL,
    Total_carbohydrates REAL,
    Fiber REAL,
    Sugars REAL,
    Protein REAL,
    Vitamins TEXT,
    Minerals TEXT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
