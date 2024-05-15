// Importa Express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import crypto from 'crypto';
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
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola Mundo');
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
    let StringQuery = "SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID WHERE ";
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
        StringQuery += `Products.Price >= ${req.query.MinPrice}'`;
        StringQuery += AND;
      }
      if ('MaxPrice' in req.query) {
        StringQuery += `Products.Price <= ${req.query.MaxPrice}`;
        StringQuery += AND;
      } if ('MinRating' in req.query) {
        StringQuery += `Products.Rating >= ${req.query.customerRating}`;
        StringQuery += AND;
      } if ('MaxRating' in req.query) {
        StringQuery += `Products.Rating <= ${req.query.customerRating}`;
        StringQuery += AND;
      } if ('SecundaryCategoryId' in req.query) {
        StringQuery += `Products.SecundaryCategoryId = ${req.query.SecundaryCategoryId}`;
        StringQuery += AND;
      }
      if ( StringQuery.endsWith("AND ")){
        StringQuery = StringQuery.slice(0, -5);
      }
      StringQuery += ";";
      //console.log(StringQuery);
      const data = await db.execute(StringQuery);
      if (data.rows.length === 0) {
        res.sendStatus(404); // Si no hay resultados, enviar 404
      } else {
        res.status(200).send(data.rows); // Si hay resultados, enviar los datos
      }
    } else {
      const data = await db.execute("SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID");
      res.status(200).send(data.rows);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send([]);
  }
});
app.get('/api/v1/products/:id', async (req, res) => {
  let AND = "";
  const id = req.params.id;
  try {
    let StringQuery = `SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID WHERE Products.ProductID = ${id}`;
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
      SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName
      FROM Products
      LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID
      LEFT JOIN Shops ON Products.ShopID = Shops.ShopID
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
      WHERE Reviews.ProductID=${req.params.id}
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

// INSERT INTO Users (FirstName, LastName, Email, Password, Phone, UserType, AssociatedStore, AccountStatus)
// VALUES
//     ('Juan', 'Pérez', 'juan@example.com', 'contraseña123', '123456789', 'consumer', NULL, 'active'),
//     ('María', 'Gómez', 'maria@example.com', 'password456', '987654321', 'producer', 'Tienda de Ropa', 'active'),
//     ('Carlos', 'López', 'carlos@example.com', 'clave789', '567891234', 'delivery', NULL, 'inactive');

// Endpoint para crear un nuevo usuario
app.post('/api/v1/users', async (req, res) => {
  // console.log(req.body);
  let { UserID,FirstName, LastName, Email, Phone } = req.body;
  //console.log(UserID,FirstName, LastName, Email, Phone);
  if (req.body.FirstName === undefined || req.body.LastName === undefined || req.body.Email === undefined || req.body.UserID === undefined || req.body.Phone === undefined ) {
    res.status(400).send({ message: 'Faltan datos' });
  } else{
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

// Endpoint para obtener información de un usuario específico por su ID
app.get('/api/v1/users/:id', (req, res) => {

});
app.get('/console', (req, res) => {
  try{
    console.log(req.body);
    res.status(200).send("hola");
  } catch (error) {
    res.status(500).send({ message: 'Error al cargar datos' });
  }});

app.get('/charger', (req, res) => {
  try{
    const query = `INSERT INTO Reviews (ProductID, Comment, UserID, AssignedRating)
    VALUES
        (1, 'Muy buena calidad.', 1, 5),
        (2, 'Excelente calidad.', 1, 4),
        (3, 'Increible producto, llego rapido y excelente enbalaje.', 2, 5),
        (1, 'Venia uno podrido', 2, 2),
        (3, 'No era un buen producto', 3, 3);
`;    

    const data = db.execute(query);
    res.status(200).send(data.rows);
  } catch (error) {
    res.status(500).send({ message: 'Error al cargar datos' });
  }

});
// Endpoint para actualizar información de un usuario por su ID
app.put('/api/v1/users/:id', (req, res) => {

});

// Endpoint para eliminar un usuario por su ID
app.delete('/api/v1/users/:id', (req, res) => {

});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
