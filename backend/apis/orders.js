function backendOrders(app, db) {

  app.get('/api/v1/orders/:id', async (req, res) => {
    try {
      const id = req.params.id;
      let query = `SELECT Orders.*,   
          Addresses.AddressTitle 
          FROM Orders 
          LEFT JOIN Addresses ON Addresses.AddressID = Orders.AddressID 
          WHERE Orders.UserID ='${id}' AND Orders.OrderStatus != 'deleted' 
          ORDER BY Orders.OrderDate DESC`;
      const recents = req.query.recents === 'true'; // Convertir a booleano
      if (recents) {
        query += " LIMIT 3;"; // Cambiar 10 al número deseado de pedidos recientes
      }

      const data = await db.execute(query);

      if (data.rows.length === 0) {
        res.status(404).send([]);
    } else {
        
      const result = await Promise.all(data.rows.map(async (order) => {
        const ordersProducts = await db.execute(`
              SELECT OrderProducts.*, Products.ProductName,Products.Price,ProductImages.ImageContent, Shops.ShopName FROM OrderProducts 
              JOIN Shops ON OrderProducts.ShopID = Shops.ShopID
              JOIN Products ON OrderProducts.ProductID = Products.ProductID 
              JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID 
              WHERE OrderID = '${order.OrderID}'`);
        return { ...order, "OrderProducts": ordersProducts.rows };
      }));
      res.status(200).send(result);
    }
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al obtener los pedidos de la base de datos');
    }
  });

  app.put('/api/v1/orders/:id', async (req, res) => {
    try {
      const orderId = req.params.id;
      const updates = req.body;

      // Construir la consulta de actualización dinámicamente
      let updateOrderQuery = 'UPDATE Orders SET';
      const updateValues = [];
      for (const key in updates) {
        if (Object.hasOwnProperty.call(updates, key)) {
          updateValues.push(`${key} = '${updates[key]}'`);
        }
      }
      updateOrderQuery += ` ${updateValues.join(', ')} WHERE OrderID = '${orderId}'`;

      await db.execute(updateOrderQuery);

      res.status(200).send({ message: `Pedido ${orderId} actualizado exitosamente.` });
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      res.status(500).send({ error: "Error interno del servidor." });
    }
  });
  app.post('/api/v1/orders', async (req, res) => {
    try {
      const { UserID, AddressID, OrderDate, TOTAL, Products } = req.body;
      const parseProducts = JSON.parse(Products);
      const insertOrderQuery = `INSERT INTO Orders (UserID, AddressID, OrderDate, TOTAL) VALUES ('${UserID}', '${AddressID}', '${OrderDate}', '${TOTAL}')`;
      await db.execute(insertOrderQuery);
      const selectOrderQuery = `SELECT OrderID FROM Orders WHERE UserID = '${UserID}' AND AddressID = '${AddressID}' AND OrderDate = '${OrderDate}' AND TOTAL = '${TOTAL}'`;
      const orderData = await db.execute(selectOrderQuery);
      const orderId = orderData.rows[0].OrderID;

      for (const product of parseProducts) {
        const { ProductID, ShopID, Quantity } = product;
        await db.execute(`INSERT INTO OrderProducts (OrderID, ShopID, ProductID, AddressID, Quantity) VALUES ('${orderId}', '${ShopID}', '${ProductID}', '${AddressID}', '${Quantity}')`);
        const orderProductsQuery = await db.execute(`SELECT OrderProductsID FROM OrderProducts WHERE OrderID = '${orderId}' AND ProductID = '${ProductID}' AND ShopID = '${ShopID}' AND AddressID = '${AddressID}' AND Quantity = '${Quantity}'`);
        const OrderProductsID = orderProductsQuery.rows[0].OrderProductsID;
        await db.execute(`INSERT INTO OrdersStatus (OrderProductsID, OrderStatus, OrderStatusDate) VALUES ('${OrderProductsID}', 'pending', '${OrderDate}')`);
      }

      res.status(200).send({ message: "Orden creada exitosamente." });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).send({ error: "Error interno del servidor." });
    }
  });



  app.get('/api/v1/orders/:userId/:orderId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const orderId = req.params.orderId;
      let query = `SELECT *
          FROM Orders  
          WHERE Orders.UserID ='${userId}' AND Orders.OrderStatus != 'deleted' 
          AND Orders.OrderID = '${orderId}' 
          ORDER BY Orders.OrderDate DESC`;
      const data = await db.execute(query);
      const address = await db.execute(`SELECT * FROM Addresses WHERE AddressID = '${data.rows[0].AddressID}'`);
      const result = await Promise.all(data.rows.map(async (order) => {
        const ordersProducts = await db.execute(`
              SELECT OrderProducts.*, Products.ProductName,Products.Price, Shops.ShopName,ProductImages.ImageContent FROM OrderProducts 
              JOIN Shops ON OrderProducts.ShopID = Shops.ShopID 
              JOIN Products ON OrderProducts.ProductID = Products.ProductID 
              JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID 
              WHERE OrderID = '${order.OrderID}'`);
        const finalData = await Promise.all(ordersProducts.rows.map(async (order) => {
          const status = await db.execute(`SELECT * FROM OrdersStatus WHERE OrderProductsID = '${order.OrderProductsID}'`);
          const FinalOrderProducts = { ...order, "OrderStatus": status.rows };
          return FinalOrderProducts;
        }));
        return { ...order, "Address": address.rows, "OrderProducts": finalData };
      }));
      res.status(200).send(result);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al obtener los pedidos de la base de datos');
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

  app.get('/api/v1/ordersStatus/:orderID', async (req, res) => {
    try {
      const userId = req.params.userId;
      const orderId = req.params.orderID;
      const data = await db.execute(`SELECT * FROM OrdersStatus WHERE OrderProductsID = '${orderId}'`);
      res.status(200).send(data.rows);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al obtener los estados del pedido de la base de datos');
    }
  });



}

export { backendOrders };