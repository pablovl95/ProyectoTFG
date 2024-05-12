// Importa Express
import express from 'express';
import morgan from 'morgan';
const app = express();
const PORT = 5000;

// Middleware para manejar datos JSON
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/v1/users', (req, res) => {
    res.send('Hello World');
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
