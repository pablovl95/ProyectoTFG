// Importa Express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
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

app.get('/api/v1/users', async (req, res) => {
  data = await db.execute("SELECT * FROM Users");
  res.status(200).send(data.rows);
});

app.get('/api/v1/products', async (req, res) => {
  let AND = "";
  try {
    let StringQuery = "SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID WHERE ";
    console.log(req.query);
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
      if ('ProductID' in req.query) {
        StringQuery += `Products.ProductID = ${req.query.ProductID}`;
        StringQuery += AND;
      }
      if ( StringQuery.endsWith("AND ")){
        StringQuery = StringQuery.slice(0, -5);
      }
      StringQuery += ";";
      console.log(StringQuery);
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
    console.log(data.rows);
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


// Endpoint para crear un nuevo usuario
app.post('/api/v1/users', (req, res) => {

});

// Endpoint para obtener información de un usuario específico por su ID
app.get('/api/v1/users/:id', (req, res) => {

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
