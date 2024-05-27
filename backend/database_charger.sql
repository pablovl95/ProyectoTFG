DROP TABLE IF EXISTS Reviews;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS Products;

DROP TABLE IF EXISTS Categories;

DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Shops;

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
    UserID INTEGER NOT NULL, -- Foreign key para vincular con la tabla Users
    AddressID INTEGER NOT NULL, -- Foreign key para vincular con la tabla Addresses
    ShopDescription TEXT,
    OpeningHours TEXT,
    Phone TEXT,
    Email TEXT,
    TotalSales INTEGER DEFAULT 0 -- Nuevo campo para total de ventas
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
    AssociatedStoreID INTEGER,
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
    PrincipalCategoryId INTEGER NOT NULL,
    SecundaryCategoryId INTEGER,
    Price REAL,
    Rating REAL CHECK (Rating BETWEEN 0 AND 5),
    StockAvailability INTEGER,
    TotalSales INTEGER DEFAULT 0,
    TotalComments INTEGER DEFAULT 0,
    ProductImages TEXT,
    ShopID TEXT NOT NULL,
    FOREIGN KEY (PrincipalCategoryId) REFERENCES Categories (CategoryID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

CREATE TABLE
  Reviews (
    ReviewID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
    ProductID INTEGER NOT NULL,
    Comment TEXT,
    UserID INTEGER NOT NULL,
    AssignedRating INTEGER CHECK (AssignedRating BETWEEN 1 AND 5),
    FOREIGN KEY (ProductID) REFERENCES Products (ProductID),
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
  );

-- Table for storing addresses
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
    Summary NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

CREATE TABLE
  ProductsOrders (
    ProductsOrderID TEXT PRIMARY KEY DEFAULT (
      LOWER(HEX(RANDOMBLOB(4))) || LOWER(HEX(RANDOMBLOB(2))) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || SUBSTR('89ab', 1 + (ABS(RANDOM()) % 4) / 2, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))), 2) || LOWER(HEX(RANDOMBLOB(6)))
    ),
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
    Summary NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (ShopID) REFERENCES Shops (ShopID)
  );

INSERT INTO
  Shops (
    ShopID,
    ShopName,
    UserID,
    AddressID,
    ShopDescription,
    OpeningHours,
    Phone,
    Email,
    TotalSales
  )
VALUES
  (
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7',
    'Tienda Orgánica',
    1,
    1,
    'Tienda especializada en productos orgánicos',
    'Lun-Vie: 8:00-20:00, Sáb-Dom: 9:00-18:00',
    '+1234567890',
    'info@tiendaorganica.com',
    0
  ),
  (
    'b8c4d5e6f7g8h9i0j1k2l3m4n5o6p7',
    'Supermercado Saludable',
    2,
    2,
    'Ofrecemos una amplia variedad de productos saludables',
    'Lun-Sáb: 7:00-21:00, Dom: 8:00-18:00',
    '+0987654321',
    'contacto@supermercadosaludable.com',
    0
  );

-- Actualización de los datos para la categoría en español
INSERT INTO
  Categories (CategoryID, CategoryName, CategoryDescription)
VALUES
  (
    '1',
    'Frutas',
    'Productos frescos y deliciosos directamente de la naturaleza'
  ),
  (
    '2',
    'Verduras',
    'Variedad de verduras frescas y orgánicas para una alimentación saludable'
  ),
  (
    '3',
    'Productos de Colmena',
    'Delicias naturales producidas por nuestras amigables abejas'
  ),
  (
    '4',
    'Lácteos',
    'Productos lácteos frescos y nutritivos para tu dieta diaria'
  ),
  (
    '5',
    'Carne',
    'Carnes frescas y de calidad para satisfacer tus antojos'
  ),
  (
    '6',
    'Huevos',
    'Huevos frescos y orgánicos, directamente del gallinero a tu mesa'
  ),
  (
    '7',
    'Cereales',
    'Variedad de cereales nutritivos para un desayuno energético'
  );

INSERT INTO
  Users (
    UserID,
    FirstName,
    LastName,
    Email,
    Phone,
    UserType,
    AssociatedStoreID,
    AccountStatus
  )
VALUES
  (
    'bb4071fcba54d28998e27925955ef79',
    'Juan',
    'Pérez',
    'juan@example.com',
    667323456,
    'consumer',
    NULL,
    'active'
  ),
  (
    'af0e9207f761a8d8646b99f88b2f0ee',
    'María',
    'Gómez',
    'maria@example.com',
    667323456,
    'producer',
    NULL,
    'active'
  ),
  (
    'c8892c2ada205bf893b69d8243181a3',
    'Carlos',
    'López',
    'carlos@example.com',
    667323456,
    'delivery',
    NULL,
    'inactive'
  );

INSERT INTO
  Products (
    ProductID,
    ProductName,
    ProductDescription,
    PrincipalCategoryId,
    SecundaryCategoryId,
    Price,
    Rating,
    StockAvailability,
    TotalSales,
    TotalComments,
    ProductImages,
    ShopID
  )
VALUES
  (
    '21fcc4998068710985641ca3c58fd77',
    'Manzana Orgánica',
    'Manzanas frescas y orgánicas cultivadas con cuidado',
    1,
    NULL,
    2.99,
    4,
    100,
    0,
    2,
    '[https://rodaleinstitute.org/wp-content/uploads/Apples-2-600x400.jpg, https://rodaleinstitute.org/wp-content/uploads/Apples-2-600x400.jpg, https://freshindiaorganics.com/cdn/shop/products/Apples.jpg?v=1686739530]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd78',
    'Plátano Orgánico',
    'Plátanos orgánicos frescos y llenos de sabor',
    1,
    NULL,
    1.99,
    5,
    250,
    0,
    1,
    '[https://chiquitabrands.com/wp-content/uploads/2019/08/Organics2.jpg,https://www.melissas.com/cdn/shop/products/image-of-organic-bananas-organics-14763756421164_600x600.jpg?v=1616958064, https://freshindiaorganics.com/cdn/shop/products/Bananas-Edited.jpg?v=1686727223]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd79',
    'Zanahoria Orgánica',
    'Zanahorias frescas y orgánicas, perfectas para tus recetas saludables',
    2,
    NULL,
    0.99,
    3,
    100,
    0,
    0,
    '[https://tamarorganics.co.uk/wp-content/uploads/2017/11/Carrot-Oxhella-3.jpg, https://tamarorganics.co.uk/wp-content/uploads/2017/11/Carrot-Miami-2.jpg, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy7ImCGPCRsNUDVtl8RQyGDF601P4W_Wp_OG1RA0f-ZA&s]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd80',
    'Tomate Orgánico',
    'Tomates orgánicos maduros y jugosos, directamente del huerto',
    2,
    NULL,
    1.49,
    4,
    22,
    0,
    2,
    '[https://attra.ncat.org/wp-content/uploads/2022/04/tomato.jpg, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3uVQxZMhsqJwrU63P9VmbssIPtbPl248-cOq_CGCC1Q&s, https://media.npr.org/assets/img/2013/02/20/organictomatoess-9eb3642825e1b3be1b481c1592b4925c2cf3ae29.jpg]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd81',
    'Naranja Orgánica',
    'Naranjas frescas y jugosas, llenas de vitamina C y sabor natural',
    1,
    NULL,
    2.49,
    4,
    11,
    0,
    0,
    '[https://www.theorangefarmer.com/wp-content/uploads/2022/10/naranja.jpg, https://www.huelvainformacion.es/2021/11/23/provincia/Naranjas-Organic-Citrus_1631847659_147786435_1200x675.jpg, https://previews.123rf.com/images/bondvit/bondvit1703/bondvit170301460/74706781-kumquat-en-un-plato-raw-organic-orange-kumquats-naranjas-peque%C3%B1as-naranja-china-naranjas-ovaladas.jpg]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd82',
    'Espinaca Orgánica',
    'Espinacas frescas y orgánicas, ideales para ensaladas y platos saludables',
    2,
    NULL,
    1.99,
    5,
    150,
    0,
    0,
    '[https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75HOLIAoxrXWXtCHFNzkwE0a2kUVwouYWnHlntkwcyQ&s, https://freshindiaorganics.com/cdn/shop/products/Spinach-Edited.jpg?v=1569230059, https://www.kroger.com/product/images/large/front/0001111091128]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd83',
    'Fresa Orgánica',
    'Fresas frescas y orgánicas, llenas de sabor y antioxidantes',
    1,
    NULL,
    3.99,
    4,
    100,
    0,
    0,
    '[https://img.huffingtonpost.es/files/image_720_480/uploads/2024/03/06/imagen-de-archivo-de-fresas-en-una-fruteria.jpeg, https://modernfarmer.com/wp-content/uploads/2018/07/how-to-grow-strawberries-1200x900.jpg, https://cdn.shopify.com/s/files/1/0613/2249/4130/t/3/assets/organic_strawberries.jpg?v=1652698115]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd84',
    'Brócoli Orgánico',
    'Brócoli fresco y orgánico, rico en nutrientes y sabor',
    2,
    NULL,
    1.79,
    3,
    500,
    0,
    0,
    '[https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202301/18/00118163500129____2__600x600.jpg, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv1EEZp64e0dUbIZUSmkFeklaPejXGVrP0SYPvuwc8Mg&s, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2PMdjgH6_5esL4W5t6cMA9Zd6tB9UcMOvAZ0XkRJphA&s]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd85',
    'Piña Orgánica',
    'Piñas dulces y refrescantes, perfectas para disfrutar en cualquier momento',
    1,
    NULL,
    4.99,
    5,
    100,
    0,
    0,
    '[https://fairtrasa.com/wp-content/uploads/pineapple-bg.jpg, https://www.melissas.com/cdn/shop/products/image-of-organic-pineapple-fruit-28663963680812_600x600.jpg?v=1628112278,https://www.froghollow.com/cdn/shop/products/Pineapple2-Edited_300x300.jpg?v=1664512936]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd86',
    'Pepino Orgánico',
    'Pepinos frescos y orgánicos, perfectos para ensaladas y snacks saludables',
    2,
    NULL,
    1.29,
    4,
    250,
    0,
    0,
    '[https://www.diggers.com.au/cdn/shop/products/cucumber-double-yield-s0961_2ebf04c5-a6d1-4103-ab90-dd15c4559037_2048x.jpg, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_whNNlOFR2HplqElYVJrabjPSsKie_jPDCaLOZeeFw&s, https://mckenzieseeds.com/cdn/shop/products/Mck_VegetableHL_140118_Cucumber_NationalPickling_front_0bb82ee0-e27a-4391-b7b9-8de4fa362a35.jpg?v=1652889297]',
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  );

-- Tabla de revisiones
INSERT INTO
  Reviews (ProductID, Comment, UserID, AssignedRating)
VALUES
  (
    '21fcc4998068710985641ca3c58fd77',
    'Muy buena calidad.',
    'c8892c2ada205bf893b69d8243181a3',
    5
  ),
  (
    '21fcc4998068710985641ca3c58fd77',
    'Excelente calidad.',
    'c8892c2ada205bf893b69d8243181a3',
    4
  ),
  (
    '21fcc4998068710985641ca3c58fd77',
    'Increible producto, llego rapido y excelente enbalaje.',
    'c8892c2ada205bf893b69d8243181a3',
    5
  ),
  (
    '21fcc4998068710985641ca3c58fd77',
    'Venia uno podrido',
    'c8892c2ada205bf893b69d8243181a3',
    2
  ),
  (
    '21fcc4998068710985641ca3c58fd77',
    'No era un buen producto',
    'c8892c2ada205bf893b69d8243181a3',
    3
  );

INSERT INTO
  Addresses (
    AddressType,
    UserID,
    StreetAddress,
    StreetNumber,
    FLOOR,
    Staircase,
    City,
    State,
    PostalCode,
    Country
  )
VALUES
  (
    'Home',
    'c8892c2ada205bf893b69d8243181a3',
    'Calle de Alcalá',
    '123',
    '3',
    'NO',
    'Madrid',
    'Madrid',
    '28001',
    'España'
  ),
  (
    'Work',
    'c8892c2ada205bf893b69d8243181a3',
    'Avenida de América',
    '45',
    '7',
    'YES',
    'Madrid',
    'Madrid',
    '28002',
    'España'
  ),
  (
    'Home',
    'c8892c2ada205bf893b69d8243181a3',
    'Calle de Serrano',
    '89',
    '5',
    'NO',
    'Madrid',
    'Madrid',
    '28006',
    'España'
  ),
  (
    'Work',
    'c8892c2ada205bf893b69d8243181a3',
    'Gran Vía',
    '12',
    '10',
    'YES',
    'Madrid',
    'Madrid',
    '28013',
    'España'
  ),
  (
    'Home',
    'c8892c2ada205bf893b69d8243181a3',
    'Carrer de Balmes',
    '200',
    '1',
    'NO',
    'Barcelona',
    'Cataluña',
    '08006',
    'España'
  ),
  (
    'Work',
    'c8892c2ada205bf893b69d8243181a3',
    'Passeig de Gràcia',
    '50',
    '2',
    'YES',
    'Barcelona',
    'Cataluña',
    '08007',
    'España'
  ),
  (
    'Home',
    'c8892c2ada205bf893b69d8243181a3',
    'Calle Mayor',
    '15',
    '4',
    'NO',
    'Valencia',
    'Comunidad Valenciana',
    '46001',
    'España'
  ),
  (
    'Work',
    'c8892c2ada205bf893b69d8243181a3',
    'Avenida del Puerto',
    '23',
    '3',
    'YES',
    'Valencia',
    'Comunidad Valenciana',
    '46021',
    'España'
  ),
  (
    'Home',
    'c8892c2ada205bf893b69d8243181a3',
    'Calle Larios',
    '10',
    '2',
    'NO',
    'Málaga',
    'Andalucía',
    '29015',
    'España'
  ),
  (
    'Work',
    'c8892c2ada205bf893b69d8243181a3',
    'Avenida de Andalucía',
    '33',
    '8',
    'YES',
    'Málaga',
    'Andalucía',
    '29006',
    'España'
  );