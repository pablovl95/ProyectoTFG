function backendReviews (app, db, upload) {
    
app.get('/api/v1/reviews/:id', async (req, res) => {
    const response = [];
    try {
      const query = `
        SELECT Reviews.*, Users.FirstName
        FROM Reviews
        INNER JOIN Users ON Reviews.UserID = Users.UserID
        WHERE Reviews.ProductID='${req.params.id}'
      `;
      const reviewsData = await db.execute(query);
      if (reviewsData.rows.length === 0) {
        res.sendStatus(404);
      } else {
        // Iterar sobre cada revisión para comprobar si contiene una foto
        for (let review of reviewsData.rows) {
          if (review.ContainsPhotos === 1) {
            const imageQuery = `
              SELECT *
              FROM Review_Images
              WHERE ReviewID = '${review.ReviewID}'
            `;
            const imageData = await db.execute(imageQuery);
            response.push({ ...review, images: imageData.rows });
          }
          else {
            response.push(review);
          }
        }
  
        res.status(200).send(response); // Enviar los datos modificados
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send([]);
    }
  });
  
  
  
  app.get('/api/v1/reviewsImages/:id', async (req, res) => {
    try {
      const query = `
        SELECT * FROM Review_Images
        WHERE ReviewID='${req.params.id}'
      `;
      const data = await db.execute(query);
      res.status(200).send(data.rows);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send([]);
    }
  });
  
  app.post('/api/v1/reviews', upload.array('images', 4), async (req, res) => {
    try {
      //console.log(req.body);
      const { Comment, ProductID, Rating, UserID, containsPhoto } = req.body;
      const images = req.files;
  
      // Validar datos básicos
      if (!Comment || !Rating || !ProductID || !UserID) {
        return res.status(400).send('Todos los campos son obligatorios.');
      }
      const date = new Date();
  
      // Inserción de la reseña
      const reviewQuery = `
        INSERT INTO Reviews (ProductID, Comment, AssignedRating, UserID, UploadDate, ContainsPhotos) 
        VALUES ('${ProductID}', '${Comment}', ${Rating}, '${UserID}', '${date.toISOString()}', ${containsPhoto})
      `;
  
      await db.execute(reviewQuery);
  
      // Obtener el ID de la reseña recién insertada
      const reviewResult = await db.execute(`
        SELECT ReviewID FROM Reviews 
        WHERE Comment = '${Comment}'
          AND AssignedRating = ${Rating} 
          AND UploadDate = '${date.toISOString()}'
          AND ProductID = '${ProductID}' 
          AND UserID = '${UserID}'
      `);
  
      const ReviewID = reviewResult.rows[0].ReviewID; // Ajustar según cómo tu DB devuelve resultados
      console.log(ReviewID);
      if (containsPhoto === '1' && images.length > 0) {
        for (const image of images) {
          const base64Image = Buffer.from(image.buffer).toString('base64');
  
          const imageInsertQuery = `
            INSERT INTO Review_Images (ReviewID, ImageContent) 
            VALUES ('${ReviewID}', '${base64Image}')
          `;
  
          await db.execute(imageInsertQuery);
        }
      }
  
      res.status(200).send('Reseña agregada correctamente');
    } catch (error) {
      console.error('Error al insertar en la base de datos:', error);
      res.status(500).send('Error al agregar la reseña a la base de datos');
    }
  });
  
}

export { backendReviews };