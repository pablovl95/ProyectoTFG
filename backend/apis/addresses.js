function backendAddresses(app, db) {

  // GET para obtener una dirección por ID de usuario
  app.get('/api/v1/addresses/:id', async (req, res) => {
    try {
      const data = await db.execute(`SELECT * FROM Addresses WHERE UserID = '${req.params.id}'`);
      res.status(200).send(data.rows);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error en el servidor');
    }
  });

  // GET para obtener todas las direcciones
  app.get('/api/v1/addresses', async (req, res) => {
    try {
      const data = await db.execute('SELECT * FROM Addresses');
      res.status(200).send(data.rows);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al obtener las direcciones de la base de datos');
    }
  });

  // DELETE para eliminar una dirección por ID de dirección
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

  // PUT para actualizar una dirección por ID de dirección
  app.put('/api/v1/addresses/:id', async (req, res) => {
    const { AddressTitle, FirstName, LastName, Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City, UserID } = req.body;
    const { id } = req.params;
    try {
      const updateQuery = `
        UPDATE Addresses
        SET AddressTitle = '${AddressTitle}', FirstName = '${FirstName}', LastName = '${LastName}', Phone = '${Phone}',
            AddressLine = '${AddressLine}', AddressNumber = '${AddressNumber}', PostalCode = '${PostalCode}',
            Country = '${Country}', Province = '${Province}', City = '${City}', UserID = '${UserID}'
        WHERE AddressID = '${id}'
      `;
      const resp = await db.execute(updateQuery);
      res.status(200).send(resp);
    } catch (error) {
      console.error('Error al actualizar la dirección en la base de datos:', error);
      res.status(500).send('Error al actualizar la dirección en la base de datos');
    }
  });

  // POST para crear una nueva dirección
  app.post('/api/v1/addresses', async (req, res) => {
    const { UserID, AddressTitle, FirstName, LastName, DefaultAddress, Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City } = req.body;
    try {
      const insertQuery = `
        INSERT INTO Addresses (UserID, AddressTitle, FirstName, LastName, Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City, DefaultAddress)
        VALUES ('${UserID}', '${AddressTitle}', '${FirstName}', '${LastName}', '${Phone}', '${AddressLine}', '${AddressNumber}', '${PostalCode}', '${Country}', '${Province}', '${City}', ${DefaultAddress ? 1 : 0})
      `;
      await db.execute(insertQuery);
      const response = await db.execute(`SELECT * FROM Addresses WHERE UserID = '${UserID}' AND AddressTitle = '${AddressTitle}' AND FirstName = '${FirstName}' AND LastName = '${LastName}' AND Phone = '${Phone}' AND AddressLine = '${AddressLine}' AND AddressNumber = '${AddressNumber}' AND PostalCode = '${PostalCode}' AND Country = '${Country}' AND Province = '${Province}' AND City = '${City}' AND DefaultAddress = ${DefaultAddress ? 1 : 0}`);
      res.status(201).json(response.rows[0]);
    } catch (error) {
      console.error('Error al crear la dirección en la base de datos:', error);
      res.status(500).send('Error al crear la dirección en la base de datos');
    }
  });

  // PUT para establecer una dirección como predeterminada
  app.get('/api/v1/defaultAddress/:userId/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;

    try {
      const deactivateQuery = `
        UPDATE Addresses
        SET DefaultAddress = 0
        WHERE UserID = '${userId}'
      `;
      await db.execute(deactivateQuery);

      const activateQuery = `
        UPDATE Addresses
        SET DefaultAddress = 1
        WHERE AddressID = '${addressId}' AND UserID = '${userId}'
      `;
      const result = await db.execute(activateQuery);
      console.log('result:', result);
      if (result.rowsAffected === 0) {
        res.status(404).send('La dirección especificada no pertenece al usuario o no se encontró.');
      } else {
        res.status(200).send('Dirección predeterminada establecida correctamente');
      }
    } catch (error) {
      console.error('Error al establecer la dirección predeterminada en la base de datos:', error);
      res.status(500).send('Error al establecer la dirección predeterminada en la base de datos');
    }
  });

}

export { backendAddresses };
