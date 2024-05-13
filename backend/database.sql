CREATE TABLE Users (
    ID INTEGER PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Phone TEXT,
    UserType TEXT CHECK(UserType IN ('delivery', 'producer', 'consumer', 'administrator')) NOT NULL,
    AssociatedStore TEXT,
    AccountStatus TEXT CHECK(AccountStatus IN ('active', 'inactive')) NOT NULL
);

-- Table for storing addresses
CREATE TABLE Addresses (
    AddressID INTEGER PRIMARY KEY,
    AddressType TEXT NOT NULL,
    StreetAddress TEXT NOT NULL,
    StreetNumber TEXT,
    Floor TEXT,
    Staircase TEXT
);
-- Table for storing products
CREATE TABLE Products (
    ProductID INTEGER PRIMARY KEY,
    ProductName TEXT NOT NULL,
    ProductDescription TEXT,
    PrincipalCategoryId INTEGER NOT NULL,
    SecundaryCategoryId INTEGER,
    Price REAL,
    Rating REAL CHECK(Rating BETWEEN 0 AND 5),
    StockAvailability INTEGER,
    ProductImages TEXT,
    FOREIGN KEY (PrincipalCategoryId) REFERENCES Categories(CategoryID)
);
-- Table for storing product reviews
CREATE TABLE ProductReviews (
    ReviewID INTEGER PRIMARY KEY,
    ProductID INTEGER NOT NULL, 
    Comment TEXT,
    UserID INTEGER NOT NULL, 
    AssignedRating INTEGER CHECK(AssignedRating BETWEEN 1 AND 5)
);

-- Table for storing product categories
CREATE TABLE Categories (
    CategoryID INTEGER PRIMARY KEY,
    CategoryName TEXT NOT NULL,
    CategoryDescription TEXT
);
-- Table for storing stores
CREATE TABLE Stores (
    StoreID INTEGER PRIMARY KEY,
    StoreName TEXT NOT NULL,
    UserID INTEGER NOT NULL, -- Foreign key to link with Users table
    AddressID INTEGER NOT NULL, -- Foreign key to link with Addresses table
    StoreDescription TEXT,
    OpeningHours TEXT,
    Phone TEXT,
    Email TEXT
);


-- Table for storing orders
CREATE TABLE Orders (
    OrderID INTEGER PRIMARY KEY,
    ChosenProducts TEXT, -- Assuming a list of product IDs separated by commas
    UserID INTEGER NOT NULL, -- Foreign key to link with Users table
    StoreID INTEGER NOT NULL, -- Foreign key to link with Stores table
    SelectedDeliveryPersonID INTEGER, -- Foreign key to link with Users table (delivery person)
    OrderDateTime DATETIME,
    OrderStatus TEXT CHECK(OrderStatus IN ('Pending', 'In Progress', 'Completed', 'Cancelled', 'Refunded')) NOT NULL,
    DeliveryInformation TEXT,
    PaymentDetails TEXT
);


-- Table for storing customer service chat messages
CREATE TABLE CustomerServiceMessages (
    MessageID INTEGER PRIMARY KEY,
    SenderUserID INTEGER NOT NULL, -- Foreign key to link with Users table (customer)
    ReceiverWorkerID INTEGER NOT NULL, -- Foreign key to link with Users table (customer service worker)
    MessageDateTime DATETIME,
    MessageContent TEXT,
    MessageStatus TEXT CHECK(MessageStatus IN ('Read', 'Unread')) NOT NULL
);

-- Table for storing pickup points
CREATE TABLE PickupPoints (
    PickupPointID INTEGER PRIMARY KEY,
    CompanyName TEXT NOT NULL,
    AddressID INTEGER NOT NULL, -- Foreign key to link with Addresses table
    UNIQUE(CompanyName, AddressID)
);

-- Table for storing news sections
CREATE TABLE NewsSections (
    SectionID INTEGER PRIMARY KEY,
    SectionTitle TEXT NOT NULL,
    SectionDescription TEXT,
    AssociatedProducer INTEGER NOT NULL, -- Foreign key to link with Users table (producer)
    FollowersCount INTEGER
);

-- Table for storing articles in news sections
CREATE TABLE NewsArticles (
    ArticleID INTEGER PRIMARY KEY,
    ArticleTitle TEXT NOT NULL,
    ArticleDescription TEXT,
    ArticleContent TEXT,
    PublicationDateTime DATETIME,
    AuthorID INTEGER NOT NULL, -- Foreign key to link with Users table
    SectionID INTEGER NOT NULL, -- Foreign key to link with NewsSections table
    FOREIGN KEY (SectionID) REFERENCES NewsSections(SectionID)
);

-- Table for storing monthly statistics
CREATE TABLE MonthlyStatistics (
    StatisticID INTEGER PRIMARY KEY,
    StoreID INTEGER NOT NULL, -- Foreign key to link with Stores table
    MonthlySales INTEGER,
    MonthlyProfits REAL,
    BestSellingProduct TEXT,
    LeastSellingProduct TEXT
);

-- Table for storing pickup point opening requests
CREATE TABLE PickupPointOpeningRequests (
    RequestID INTEGER PRIMARY KEY,
    ApplicantFirstName TEXT NOT NULL,
    ApplicantLastName TEXT NOT NULL,
    ApplicantPhone TEXT,
    ApplicantProposal TEXT
);

