function backendAdresses(app, db) {


  app.get('/api/v1/addresses/:id', async (req, res) => {
    try {
      const data = await db.execute(`SELECT * FROM Addresses WHERE UserID = '${req.params.id}'`);
      console.log(data.rows)
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

  app.put('/api/v1/addresses/:id', async (req, res) => {

    const { AddressTitle, FirstName, LastName, Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City, UserID } = req.body;
    console.log(req.body)
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
      console.log(resp)
      res.status(200);
    } catch (error) {
      console.error('Error al actualizar la dirección en la base de datos:', error);
      res.status(500).send('Error al actualizar la dirección en la base de datos');
    }
  });

  app.post('/api/v1/addresses', async (req, res) => {
    const { UserID, AddressTitle, FirstName, LastName, DefaultAddress,Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City } = req.body;
    try {
      const insertQuery = `
        INSERT INTO Addresses (UserID, AddressTitle, FirstName, LastName, Phone, AddressLine, AddressNumber, PostalCode, Country, Province, City, DefaultAddress)
        VALUES ('${UserID}','${AddressTitle}', '${FirstName}', '${LastName}', '${Phone}', '${AddressLine}', '${AddressNumber}', '${PostalCode}', '${Country}', '${Province}', '${City}', '${DefaultAddress ? 1 : 0}');
    `;
      await db.execute(insertQuery);

      res.status(201).send('Dirección creada exitosamente');
    } catch (error) {
      console.error('Error al crear la dirección en la base de datos:', error);
      res.status(500).send('Error al crear la dirección en la base de datos');
    }
  });



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


export { backendAdresses };