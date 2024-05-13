// Importa Express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createClient } from "@libsql/client";


const db = createClient({
    url: "libsql://ecoshop-database-pablovl95.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTU1NDU5ODcsImlkIjoiNTM0NTk2MGQtNDZlOC00YWEyLWI1OTAtYmI3ODFmN2YxN2Y0In0.d3UEAwELR4V1ZCxU1j6PJM6xqe1-B4acjqLq1pHyug9JIJMln2hLhIZx4Oki2v65B_9iMCHVqYPKKS5TK7ISBw",
  });

const app = express();
const PORT = 5000;

// Middleware para manejar datos JSON
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.get('/api/v1/users', (req, res) => {
    res.send('Hello World');
});

app.get('/api/v1/products', async (req, res) => {
  try {
    let data = null;
    let counter = 0;
    let StringQuery = "SELECT * FROM Products WHERE ";
    if (Object.keys(req.query).length > 0) {
      Object.keys(req.query).forEach((key) => {
        if (counter === 0) {
          StringQuery += `${key}=${req.query[key]}`;
          counter++;
        } else {
          StringQuery += ` AND ${key}=${req.query[key]}`;
        }
      });
      console.log(StringQuery);
      data = await db.execute(StringQuery);
      if (data.rows.length === 0) {
        res.sendStatus(404); // Si no hay resultados, enviar 404
      } else {
        res.status(200).send(data.rows); // Si hay resultados, enviar los datos
      }
    } else {
      data = await db.execute("SELECT * FROM Products");
      res.status(200).send(data.rows);
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
