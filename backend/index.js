// Importa Express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer'; // Middleware para manejar la subida de archivos
import { backendProducts } from "./apis/products.js"
const upload = multer(); 
import 'dotenv/config';
import { createClient } from "@libsql/client";
import { backendAddresses } from './apis/addresses.js';
import { backendOrders } from './apis/orders.js';
import { backendReviews } from './apis/reviews.js';
import { backendUsers } from './apis/users.js';
import { backendCharger } from './apis/charger.js';

const db = createClient({
  url: process.env.LIBSQL_URL,
  authToken: process.env.LIBSQL_AUTH_TOKEN,
});

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

backendProducts(app, db, upload);
backendAddresses(app, db);
backendOrders(app, db);
backendReviews(app, db, upload);
backendUsers(app, db);
backendCharger(app, db);




app.get('/api/v1/producto', async (req, res) => {
  try {
    const query = `
CREATE TRIGGER UpdateProductRatingAndComments
AFTER INSERT ON Reviews
FOR EACH ROW
BEGIN
    UPDATE Products
    SET Rating = (SELECT AVG(AssignedRating) FROM Reviews WHERE ProductID = NEW.ProductID),
        TotalComments = (SELECT COUNT(*) FROM Reviews WHERE ProductID = NEW.ProductID)
    WHERE ProductID = NEW.ProductID;
END;
    `;
    const data = await db.execute(query);
    res.status(200).send(data);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).send('Error al obtener las categorías de la base de datos');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
