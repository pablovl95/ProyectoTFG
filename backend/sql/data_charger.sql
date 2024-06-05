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


-- Tabla de direcciones
INSERT INTO
  Addresses (
    AddressID,
    UserID,
    AddressTitle,
    FirstName,
    LastName,
    Phone,
    AddressLine,
    AdressNumber,
    PostalCode,
    Country,
    Province,
    City
  )
VALUES
  (
    '9f6f21f1356d4d1abb89049e7a9d0aa0',
    'c8892c2ada205bf893b69d8243181a3',
    'Home',
    'Carlos',
    'López',
    '667323456',
    'Calle de Alcalá',
    '123',
    '28001',
    'España',
    'Madrid',
    'Madrid'
  ),
  (
    'be2242d856264f568f961d4b2d9984db',
    'c8892c2ada205bf893b69d8243181a3',
    'Work',
    'Carlos',
    'López',
    '667323456',
    'Avenida de América',
    '45',
    '28002',
    'España',
    'Madrid',
    'Madrid'
  );

INSERT INTO
  Shops (
    ShopID,
    ShopName,
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
    '9f6f21f1356d4d1abb89049e7a9d0aa0',
    'Tienda especializada en productos orgánicos',
    'Lun-Vie: 8:00-20:00, Sáb-Dom: 9:00-18:00',
    '+1234567890',
    'info@tiendaorganica.com',
    0
  ),
  (
    'b8c4d5e6f7g8h9i0j1k2l3m4n5o6p7',
    'Supermercado Saludable',
    '9f6f21f1356d4d1abb89049e7a9d0aa0',
    'Ofrecemos una amplia variedad de productos saludables',
    'Lun-Sáb: 7:00-21:00, Dom: 8:00-18:00',
    '+0987654321',
    'contacto@supermercadosaludable.com',
    0
  );

-- Productos
INSERT INTO Products (ProductID, ProductName, ProductDescription, PrincipalCategoryID, SecundaryCategoryID, Price, Rating, StockAvailability, TotalSales, TotalComments, ImageDefaultID, ShopID)
VALUES
  (
    '21fcc4998068710985641ca3c58fd77',
    'Manzana Orgánica',
    'Manzanas frescas y orgánicas cultivadas con cuidado',
    '1',
    NULL,
    2.99,
    4,
    100,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd78',
    'Plátano Orgánico',
    'Plátanos orgánicos frescos y llenos de sabor',
    '1',
    NULL,
    1.99,
    5,
    250,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd79',
    'Zanahoria Orgánica',
    'Zanahorias frescas y orgánicas, perfectas para tus recetas saludables',
    '2',
    NULL,
    0.99,
    3,
    100,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd80',
    'Tomate Orgánico',
    'Tomates orgánicos maduros y jugosos, directamente del huerto',
    '2',
    NULL,
    1.49,
    4,
    22,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd81',
    'Naranja Orgánica',
    'Naranjas frescas y jugosas, llenas de vitamina C y sabor natural',
    '1',
    NULL,
    2.49,
    4,
    11,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd82',
    'Espinaca Orgánica',
    'Espinacas frescas y orgánicas, ideales para ensaladas y platos saludables',
    '2',
    NULL,
    1.99,
    5,
    150,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd83',
    'Fresa Orgánica',
    'Fresas frescas y orgánicas, llenas de sabor y antioxidantes',
    '1',
    NULL,
    3.99,
    4,
    100,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd84',
    'Brócoli Orgánico',
    'Brócoli fresco y orgánico, rico en nutrientes y sabor',
    '2',
    NULL,
    1.79,
    3,
    500,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd85',
    'Piña Orgánica',
    'Piñas dulces y refrescantes, perfectas para disfrutar en cualquier momento',
    '1',
    NULL,
    4.99,
    5,
    100,
    0,
    0,
    NULL,
    'a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7'
  ),
  (
    '21fcc4998068710985641ca3c58fd86',
    'Pepino Orgánico',
    'Pepinos frescos y orgánicos, perfectos para ensaladas y snacks saludables',
    '2',
    NULL,
    1.29,
    4,
    250,
    0,
    0,
    NULL,
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

-- Tabla de Imagenes