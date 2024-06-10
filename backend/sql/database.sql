CREATE TABLE
  Categories (
    CategoryID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    CategoryName TEXT NOT NULL,
    CategoryDescription TEXT
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
    AddressNumber TEXT NOT NULL,
    PostalCode TEXT NOT NULL,
    Country TEXT NOT NULL,
    Province TEXT NOT NULL,
    City TEXT NOT NULL,
    DefaultAddress BOOLEAN DEFAULT 0,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
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
    Phone TEXT,
    UserType TEXT CHECK (
      UserType IN (
        'delivery',
        'producer',
        'consumer',
        'administrator'
      )
    ) NOT NULL,
    AccountStatus TEXT CHECK (
      AccountStatus IN ('active', 'inactive', 'suspended')
    ) NOT NULL
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
    SelfShipping BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (PrincipalCategoryID) REFERENCES Categories (CategoryID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

CREATE TABLE
  ProductImages (
    ImageID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductID TEXT NOT NULL,
    ImageContent TEXT NOT NULL,
    UploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
  );

CREATE TABLE
  Reviews (
    ReviewID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductID TEXT NOT NULL,
    Comment TEXT,
    UserID TEXT NOT NULL,
    UploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    AssignedRating INTEGER CHECK (AssignedRating BETWEEN 1 AND 5),
    ContainsPhotos BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID),
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );

CREATE TABLE
  Review_Images (
    ImageID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ReviewID TEXT NOT NULL,
    ImageContent TEXT NOT NULL,
    FOREIGN KEY (ReviewID) REFERENCES Reviews (ReviewID)
  );

CREATE TABLE
  Orders (
    OrderID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    UserID TEXT NOT NULL,
    AddressID TEXT NOT NULL,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    OrderDeliveredDate DATETIME,
    OrderStatus TEXT CHECK (
      OrderStatus IN (
        'pending',
        'shipped',
        'delivered',
        'archived',
        'cancelled',
        'deleted'
      )
    ) NOT NULL DEFAULT 'pending',
    TOTAL REAL NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (AddressID) REFERENCES Addresses (AddressID)
  );

CREATE TABLE
  OrderProducts (
    OrderProductsID TEXT DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    OrderID TEXT NOT NULL,
    ShopID TEXT NOT NULL,
    AddressID TEXT NOT NULL,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    OrderDeliveredDate DATETIME,
    OrderStatus TEXT CHECK (
      OrderStatus IN (
        'pending',
        'shipped',
        'delivered',
        'archived',
        'cancelled',
        'deleted'
      )
    ) NOT NULL DEFAULT 'pending',
    ProductID TEXT NOT NULL,
    Quantity INTEGER NOT NULL,
    Carrier TEXT DEFAULT NULL,
    PRIMARY KEY (OrderProductsID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID),
    FOREIGN KEY (OrderID) REFERENCES Orders (OrderID),
    FOREIGN KEY (AddressID) REFERENCES Addresses (AddressID)
  );

CREATE TABLE
  OrdersStatus (
    OrderStatusID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    OrderProductsID TEXT NOT NULL,
    OrderStatus TEXT CHECK (
      OrderStatus IN (
        'pending',
        'shipped',
        'delivered',
        'archived',
        'cancelled',
        'deleted'
      )
    ) NOT NULL DEFAULT 'pending',
    OrderStatusDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    OrderStatusFinalDate DATETIME DEFAULT NULL,
    FOREIGN KEY (OrderProductsID) REFERENCES OrderProducts(OrderProductsID)
  );

CREATE TABLE
  Product_Info (
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
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
  );

CREATE TABLE
  Nutritional_Info (
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
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID)
  );