// Importa Express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer'; // Middleware para manejar la subida de archivos

const upload = multer(); // Eliminamos el directorio de destino para que los archivos se manejen en memoria

import 'dotenv/config';
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.LIBSQL_URL,
  authToken: process.env.LIBSQL_AUTH_TOKEN,
});

const app = express();
const PORT = 5000;

// Middleware para manejar datos JSON
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

app.get('/api/v1/users', async (req, res) => {
  try {
    const data = await db.execute(`SELECT * FROM Users`);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener el usuario de la base de datos');
  }
});

app.get('/api/v1/users/:id', async (req, res) => {
  const id = req.params.id; // Obtener el valor del parámetro ID de la solicitud
  console.log(id);
  try {
    const data = await db.execute(`SELECT * FROM Users WHERE UserID = '${id}'`);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener el usuario de la base de datos');
  }
});


app.get('/api/v1/products', async (req, res) => {
  let AND = "";
  try {
    let StringQuery = "SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID WHERE ";
    //console.log(req.query);
    if (Object.keys(req.query).length > 0) {
      if (Object.keys(req.query).length > 1) {
        AND = " AND ";
      }
      if ('q' in req.query) {
        StringQuery += `(Products.ProductName LIKE '%${req.query.q}%' OR Products.ProductDescription LIKE '%${req.query.q}%')`;
        StringQuery += AND;
      } if ('PrincipalCategoryId' in req.query) {
        StringQuery += `Products.PrincipalCategoryId = ${req.query.PrincipalCategoryId}`;
        StringQuery += AND;
      }
      if ('ShopID' in req.query) {
        StringQuery += `Products.ShopID = ${req.query.ShopID}`;
        StringQuery += AND;
      }
      if ('MinPrice' in req.query) {
        StringQuery += `Products.Price >= ${req.query.MinPrice}`;
        StringQuery += AND;
      }
      if ('MaxPrice' in req.query) {
        StringQuery += `Products.Price <= ${req.query.MaxPrice}`;
        StringQuery += AND;
      } if ('MinRating' in req.query) {
        StringQuery += `Products.Rating >= ${req.query.MinRating}`;
        StringQuery += AND;
      } if ('SecundaryCategoryId' in req.query) {
        StringQuery += `Products.SecundaryCategoryId = ${req.query.SecundaryCategoryId}`;
        StringQuery += AND;
      }
      if (StringQuery.endsWith("AND ")) {
        StringQuery = StringQuery.slice(0, -5);
      }
      StringQuery += ";";
      const data = await db.execute(StringQuery);
      if (data.rows.length === 0) {
        res.sendStatus(404); // Si no hay resultados, enviar 404
      } else {
        res.status(200).send(data.rows); // Si hay resultados, enviar los datos
      }
    } else {
      const data = await db.execute("SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID");
      res.status(200).send(data.rows);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});
app.get('/api/v1/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let StringQuery = `
    SELECT
  Products.*,
  Categories.CategoryName AS PrincipalCategoryName,
  Shops.ShopID,
  Shops.ShopName,
  ProductImages.ImageContent
FROM
  Products
  LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID
  LEFT JOIN Shops ON Products.ShopID = Shops.ShopID
  LEFT JOIN ProductImages ON ProductImages.ProductID = Products.ProductID WHERE Products.ProductID = '${id}';
    
    `;
    const data = await db.execute(StringQuery);
    if (data.rows.length === 0) {
      res.sendStatus(404); // Si no hay resultados, enviar 404
    } else {
      res.status(200).send(data.rows); // Si hay resultados, enviar los datos
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});



app.get('/api/v1/popularProducts', async (req, res) => {
  try {
    const query = `
    SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID
      ORDER BY Products.TotalSales DESC
      LIMIT 3
    `;
    const data = await db.execute(query);
    //console.log(data.rows);
    if (data.rows.length === 0) {
      res.sendStatus(404); // Si no hay resultados, enviar 404
    } else {
      res.status(200).send(data.rows); // Si hay resultados, enviar los datos
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});

app.get('/api/v1/shops/:id', async (req, res) => {
  try {
    const query = `
      SELECT * FROM Shops WHERE ShopID=${req.params.id}
    `;
    const data = await db.execute(query);
    if (data.rows.length === 0) {
      res.sendStatus(404); // Si no hay resultados, enviar 404
    } else {
      res.status(200).send(data.rows); // Si hay resultados, enviar los datos
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});
app.get('/api/v1/reviews/:id', async (req, res) => {
  try {
    const query = `
      SELECT Reviews.*, Users.FirstName, Users.ProfileImageUrl
      FROM Reviews
      INNER JOIN Users ON Reviews.UserID = Users.UserID
      WHERE Reviews.ProductID='${req.params.id}'
    `;
    //console.log(query);
    const data = await db.execute(query);
    if (data.rows.length === 0) {
      res.sendStatus(404); // Si no hay resultados, enviar 404
    } else {
      res.status(200).send(data.rows); // Si hay resultados, enviar los datos
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});

app.post('/api/v1/users', async (req, res) => {
  console.log(req.body);
  let { UserID, FirstName, LastName, Email, Phone } = req.body;
  //console.log(UserID,FirstName, LastName, Email, Phone);
  if (req.body.FirstName === undefined || req.body.LastName === undefined || req.body.Email === undefined || req.body.UserID === undefined || req.body.Phone === undefined) {
    res.status(400).send({ message: 'Faltan datos' });
  } else {
    const query = `INSERT INTO Users (UserID, FirstName, LastName, Email, Phone, UserType, AssociatedStoreID, AccountStatus) 
  VALUES ('${UserID}','${FirstName}', '${LastName}', '${Email}', '${Phone}', 'consumer', NULL, 'active');`;
    try {
      // console.log(query);
      const data = await db.execute(query);
      res.status(201).send({ message: 'Usuario creado' });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: 'Error al crear usuario' });
    }
  }

});
// Endpoint para actualizar información de un usuario por su ID
app.put('/api/v1/users/:id', (req, res) => {

});

// Endpoint para eliminar un usuario por su ID
app.delete('/api/v1/users/:id', (req, res) => {

});
app.get('/api/v1/addresses/:id', async (req, res) => {
  try {
    const data = await db.execute(`SELECT * FROM Addresses WHERE UserID = '${req.params.id}'`);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener las direcciones de la base de datos');
  }
});

app.get('/api/v1/addresses', async (req, res) => {
  try {
    const data = await db.execute('SELECT * FROM Addresses');
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener las direcciones de la base de datos');
  }
});

// Ruta DELETE para eliminar una dirección
app.delete('/api/v1/addresses/:addressId', async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const query = `DELETE FROM Addresses WHERE AddressID = '${addressId}'`;
    await db.execute(query);
    res.status(200).send('Dirección eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar dirección en la base de datos:', error);
    res.status(500).send('Error al eliminar la dirección de la base de datos');
  }
});

// Ruta PUT para actualizar una dirección existente
app.put('/api/v1/addresses/:addressId', async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const {
      AddressType,
      StreetAddress,
      StreetNumber,
      Floor,
      Staircase,
      City,
      State,
      PostalCode,
      Country
    } = req.body;

    // Verificar que al menos uno de los campos a actualizar esté presente en la solicitud
    if (!AddressType && !StreetAddress && !StreetNumber && !Floor && !Staircase && !City && !State && !PostalCode && !Country) {
      return res.status(400).send('Al menos un campo para actualizar debe estar presente');
    }

    let updates = [];

    if (AddressType) updates.push(`AddressType = '${AddressType}'`);
    if (StreetAddress) updates.push(`StreetAddress = '${StreetAddress}'`);
    if (StreetNumber) updates.push(`StreetNumber = '${StreetNumber}'`);
    if (Floor) updates.push(`Floor = '${Floor}'`);
    if (Staircase) updates.push(`Staircase = '${Staircase}'`);
    if (City) updates.push(`City = '${City}'`);
    if (State) updates.push(`State = '${State}'`);
    if (PostalCode) updates.push(`PostalCode = '${PostalCode}'`);
    if (Country) updates.push(`Country = '${Country}'`);

    const query = `
      UPDATE Addresses
      SET ${updates.join(', ')}
      WHERE AddressID = '${addressId}'
    `;
    await db.execute(query);
    res.status(200).send('Dirección actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar dirección en la base de datos:', error);
    res.status(500).send('Error al actualizar la dirección en la base de datos');
  }
});

app.post('/api/v1/addresses/:id', async (req, res) => {
  try {
    const {
      AddressType,
      StreetAddress,
      StreetNumber,
      Floor,
      Staircase,
      City,
      State,
      PostalCode,
      Country
    } = req.body;
    console.log(req.body)
    // Verificar que todos los campos necesarios estén presentes en la solicitud
    if (!AddressType || !StreetAddress || !City || !State || !PostalCode || !Country) {
      return res.status(400).send('Todos los campos obligatorios deben estar presentes');
    }

    const query = `
      INSERT INTO Addresses (
        AddressType,
        UserID,
        StreetAddress,
        StreetNumber,
        Floor,
        Staircase,
        City,
        State,
        PostalCode,
        Country
      ) VALUES ('${AddressType}', '${req.params.id}', '${StreetAddress}', '${StreetNumber}', '${Floor}', '${Staircase}', '${City}','${State}','${PostalCode}','${Country}')
    `;
    console.log(query);
    await db.execute(query);

    res.status(201).send('Dirección agregada correctamente');
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).send('Error al agregar la dirección a la base de datos');
  }
});
app.get('/api/v1/productImages/:productId', upload.single('image'), async (req, res) => {
  try {
    const data = await db.execute(`SELECT * FROM ProductImages WHERE ProductID = '${req.params.productId}'`);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).send('Error al subir la imagen');
  }
});
app.post('/api/v1/productImages/:productId', upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.productId;
    const image = req.file.buffer; // Accedemos al buffer del archivo en memoria
    await db.execute(`INSERT INTO ProductImages (ProductID, ImageContent) VALUES ('${productId}', '${image.toString('base64')}')`);
    res.status(200).send('Imagen subida correctamente');
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).send('Error al subir la imagen');
  }
});


app.get('/api/v1/producto', async (req, res) => {
  try {
    const query = `
    CREATE TRIGGER SetDefaultImageAfterInsert AFTER INSERT ON ProductImages FOR EACH ROW WHEN NEW.ProductID IS NOT NULL BEGIN
    UPDATE Products
    SET
      ImageDefaultID = NEW.ImageID
    WHERE
      ProductID = NEW.ProductID
      AND ImageDefaultID IS NULL;
    END;
    `;
    const data = await db.execute(query);
    res.status(200).send(data);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener las categorías de la base de datos');
  }
});
/////////////////////////////////////////  ORDERS /////////////////////////////////////////////////////////////////
// GET para obtener todos los pedidos
app.get('/api/v1/orders/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT Orders.*, 
    OrderProducts.*, 
    Products.ProductName, 
    ProductImages.ImageContent, 
    Addresses.AddressTitle 
FROM OrderProducts 
LEFT JOIN Orders ON OrderProducts.OrderID = Orders.OrderID 
LEFT JOIN Products ON OrderProducts.ProductID = Products.ProductID 
LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID 
LEFT JOIN Addresses ON Addresses.AddressID = Orders.AddressID 
WHERE Orders.UserID ='${id}';`
    const data = await db.execute(query);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener los pedidos de la base de datos');
  }
});

app.get('/api/v1/orders/:UserId/:OrderId', async (req, res) => {
  try {
    const UserID = req.params.UserId;
    const OrderID = req.params.UserId;
    const query = `SELECT Orders.*, 
    OrderProducts.*, 
    Products.ProductName, 
    ProductImages.ImageContent, 
    Addresses.AddressTitle 
FROM OrderProducts 
LEFT JOIN Orders ON OrderProducts.OrderID = Orders.OrderID 
LEFT JOIN Products ON OrderProducts.ProductID = Products.ProductID 
LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID 
LEFT JOIN Addresses ON Addresses.AddressID = Orders.AddressID 
WHERE Orders.UserID ='${UserID}' AND Orders;`
    const data = await db.execute(query);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener los pedidos de la base de datos');
  }
});
// POST para crear un nuevo pedido
app.post('/api/v1/orders', async (req, res) => {
  try {
    const { UserID, AddressID, Total } = req.body;
    const query = `INSERT INTO Orders (UserID, AddressID, Total) VALUES ('${UserID}', '${AddressID}', ${Total})`;
    await db.execute(query);
    res.status(201).send('Pedido creado correctamente');
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).send('Error al crear el pedido en la base de datos');
  }
});

// PUT para actualizar el estado de un pedido por su ID
app.put('/api/v1/orders/:id', async (req, res) => {
  try {
    const { OrderStatus } = req.body;
    const orderId = req.params.id;
    const query = `UPDATE Orders SET OrderStatus = '${OrderStatus}' WHERE OrderID = '${orderId}'`;
    await db.execute(query);
    res.status(200).send('Estado del pedido actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el estado del pedido en la base de datos:', error);
    res.status(500).send('Error al actualizar el estado del pedido en la base de datos');
  }
});
app.get('/api/v1/orderDetails/:userId/:orderId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const query = `
      SELECT Orders.*, 
             OrderProducts.*, 
             Products.ProductName, 
             ProductImages.ImageContent, 
             Addresses.AddressTitle 
      FROM OrderProducts 
      LEFT JOIN Orders ON OrderProducts.OrderID = Orders.OrderID 
      LEFT JOIN Products ON OrderProducts.ProductID = Products.ProductID 
      LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID 
      LEFT JOIN Addresses ON Addresses.AddressID = Orders.AddressID 
      WHERE Orders.UserID ='${userId}' AND Orders.OrderID ='${orderId}';`;
      
    const data = await db.execute(query);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener los detalles del pedido de la base de datos');
  }
});

// GET para obtener todos los productos de un pedido por su ID
app.get('/api/v1/orderProducts/:orderID', async (req, res) => {
  try {
    const orderId = req.params.orderID;
    const data = await db.execute(`SELECT * FROM OrderProducts WHERE OrderProductsID = '${orderId}'`);
    res.status(200).send(data.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener los productos del pedido de la base de datos');
  }
});

// POST para agregar productos a un pedido
app.post('/api/v1/orderProducts', async (req, res) => {
  try {
    const { OrderProductsID, ShopID, AddressID, Products } = req.body;
    const query = `INSERT INTO OrderProducts (OrderProductsID, ShopID, AddressID, Products) VALUES ('${OrderProductsID}', '${ShopID}', '${AddressID}', '${Products}')`;
    await db.execute(query);
    res.status(201).send('Productos agregados al pedido correctamente');
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).send('Error al agregar los productos al pedido en la base de datos');
  }
});

// PUT para actualizar el estado de una orden de productos por su ID
app.put('/api/v1/orderProducts/:id', async (req, res) => {
  try {
    const { AddressStatus } = req.body;
    const orderProductsId = req.params.id;
    const query = `UPDATE OrderProducts SET AddressStatus = '${AddressStatus}' WHERE OrderProductsID = '${orderProductsId}'`;
    await db.execute(query);
    res.status(200).send('Estado de la orden de productos actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el estado de la orden de productos en la base de datos:', error);
    res.status(500).send('Error al actualizar el estado de la orden de productos en la base de datos');
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
