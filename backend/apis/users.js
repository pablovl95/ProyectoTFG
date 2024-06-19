function backendUsers(app, db) {
    app.get('/api/v1/users', async (req, res) => {
        try {
            const data = await db.execute(`SELECT * FROM Users`);
            if (data.rows.length === 0) {
                res.status(404).send([]);
            } else {
                res.status(200).send(data.rows);
            }
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).send('Error al obtener el usuario de la base de datos');
        }
    });

    app.get('/api/v1/users/:id', async (req, res) => {
        const id = req.params.id; // Obtener el valor del parámetro ID de la solicitud
        try {
            const data = await db.execute(`SELECT * FROM Users WHERE UserID = '${id}'`);
            if (data.rows.length === 0) {
              res.status(404).send([]);
          } else {
              res.status(200).send(data.rows);
          }
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).send('Error al obtener el usuario de la base de datos');
        }
    });
    


    app.put('/api/v1/users/:id', async (req, res) => {
        const id = req.params.id;
        const { FirstName, LastName, email, Phone } = req.body;
        if (!FirstName || !LastName) {
            return res.status(400).send('Por favor, proporcione todos los campos requeridos (nombre, apellidos, email).');
        }
        try {
            const updateQuery = `
            UPDATE Users 
            SET FirstName = '${FirstName}', LastName = '${LastName}', Phone = '${Phone || 'NULL'}'
            WHERE UserID = '${id}'
          `;
            await db.execute(updateQuery);
            res.status(200).send('Usuario actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el usuario en la base de datos:', error);
            res.status(500).send('Error al actualizar el usuario en la base de datos');
        }
    });

    app.post('/api/v1/users', async (req, res) => {
        let { UserID, FirstName, LastName, Email, Phone } = req.body;
        if (req.body.FirstName === undefined || req.body.LastName === undefined || req.body.Email === undefined || req.body.UserID === undefined || req.body.Phone === undefined) {
          res.status(400).send({ message: 'Faltan datos' });
        } else {
          const query = `INSERT INTO Users (UserID, FirstName, LastName, Email, Phone, UserType, AccountStatus) 
        VALUES ('${UserID}','${FirstName}', '${LastName}', '${Email}', '${Phone}', 'consumer', 'active');`;
          try {
            const data = await db.execute(query);
            res.status(201).send(data);
          } catch (error) {
            console.error("Error:", error);
            res.status(500).send({ message: 'Error al crear usuario' });
          }
        }
      
      });
      


app.get('/api/v1/users/payment/:id', async (req, res) => {
  const id = req.params.id; 
  try {
      const data = await db.execute(`SELECT * FROM PaymentMethods WHERE UserID = '${id}'`);
      if (data.rows.length === 0) {
          res.status(404).send([]);
      } else {
          res.status(200).send(data.rows);
      }
  } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al obtener el usuario de la base de datos');
  }
});

app.post('/api/v1/users/payment', async (req, res) => {
  const { UserID, PaymentMethodType, ContentText } = req.body;
  try {
    const query = `
      INSERT INTO PaymentMethods (UserID, PaymentMethodType, ContentText)
      VALUES ('${UserID}', '${PaymentMethodType}', '${ContentText}')
    `;
    await db.execute(query);
    const data = await db.execute(`SELECT * FROM PaymentMethods WHERE UserID = '${UserID}' AND PaymentMethodType = '${PaymentMethodType}' AND ContentText = '${ContentText}'`);
    res.status(201).json(data.rows[0]);
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).send('Error al agregar el método de pago a la base de datos');
  }
});

app.delete('/api/v1/users/payment/:id', async (req, res) => {
  const paymentMethodId = req.params.id;
  try {
    const result = await db.execute(`DELETE FROM PaymentMethods WHERE PaymentMethodID = '${paymentMethodId}'`);
    res.status(200).send('Método de pago eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el método de pago de la base de datos:', error);
    res.status(500).send('Error al eliminar el método de pago de la base de datos');
  }
});


}

export { backendUsers };