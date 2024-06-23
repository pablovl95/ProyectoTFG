function backendProducts(app, db, upload) {
    app.get('/api/v1/products', async (req, res) => {
        let AND = "";
        try {
            let StringQuery = "SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID WHERE ";
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
                    StringQuery += `Products.Price >= ${req.query.MinPrice}`;
                    StringQuery += AND;
                }
                if ('MaxPrice' in req.query) {
                    StringQuery += `Products.Price <= ${req.query.MaxPrice}`;
                    StringQuery += AND;
                } if ('MinRating' in req.query) {
                    StringQuery += `Products.Rating >= ${req.query.MinRating}`;
                    StringQuery += AND;
                } if ('SecundaryCategoryId' in req.query) {
                    StringQuery += `Products.SecundaryCategoryId = ${req.query.SecundaryCategoryId}`;
                    StringQuery += AND;
                }
                if (StringQuery.endsWith("AND ")) {
                    StringQuery = StringQuery.slice(0, -5);
                }
                StringQuery += ";";
                const data = await db.execute(StringQuery);
                if (data.rows.length === 0) {
                    res.status(404).send([]);
                } else {
                    res.status(200).send(data.rows);
                }
            } else {
                const data = await db.execute("SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID");
                res.status(200).send(data.rows);
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send([]);
        }
    });

    app.get('/api/v1/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        try {
            let StringQuery = `
      SELECT
    Products.*,
    Categories.CategoryName AS PrincipalCategoryName,
    Shops.ShopID,
    Shops.ShopName
  FROM
    Products
    LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID
    LEFT JOIN Shops ON Products.ShopID = Shops.ShopID
    WHERE Products.ProductID = '${id}'
    ; 
      `;
            const data = await db.execute(StringQuery);
            if (data.rows.length === 0) {
                res.status(404).send([]);
            } else {
                const images = await db.execute(`SELECT * FROM ProductImages WHERE ProductID = '${id}'`);
                const info = await db.execute(`SELECT * FROM Product_Info WHERE ProductID = '${id}'`);
                const nutritional = await db.execute(`SELECT * FROM Nutritional_Info WHERE ProductID = '${id}'`);
                if (info.rows.length > 0 && nutritional.rows.length > 0 && images.rows.length > 0) {
                    res.status(200).send({ product: data.rows[0], info: info.rows[0], nutritional: nutritional.rows[0], images: images.rows });
                } else {
                    res.status(404).send([]);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send([]);
        }
    });

    app.get('/api/v1/popularProducts', async (req, res) => {
        try {
            const query = `
      SELECT Products.*, Categories.CategoryName AS PrincipalCategoryName, Shops.ShopID, Shops.ShopName, ProductImages.ImageContent FROM Products LEFT JOIN Categories ON Products.PrincipalCategoryId = Categories.CategoryID LEFT JOIN Shops ON Products.ShopID = Shops.ShopID LEFT JOIN ProductImages ON Products.ImageDefaultID = ProductImages.ImageID
        ORDER BY Products.TotalSales DESC
        LIMIT 3
      `;
            const data = await db.execute(query);
            if (data.rows.length === 0) {
                res.status(404).send([]);
            } else {
                res.status(200).send(data.rows);
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send([]);
        }
    });

    app.get('/api/v1/productImages/:productId', upload.single('image'), async (req, res) => {
        try {
            const data = await db.execute(`SELECT * FROM ProductImages WHERE ProductID = '${req.params.productId}'`);
            if (data.rows.length === 0) {
                res.status(404).send([]);
            } else {
                res.status(200).send(data.rows);
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            res.status(500).send('Error al subir la imagen');
        }
    });

    app.post('/api/v1/productImages/:productId', upload.single('image'), async (req, res) => {
        try {
            const productId = req.params.productId;
            const image = req.file.buffer;
            await db.execute(`INSERT INTO ProductImages (ProductID, ImageContent) VALUES ('${productId}', '${image.toString('base64')}')`);
            res.status(200).send('Imagen subida correctamente');
        } catch (error) {
            console.error('Error al subir imagen:', error);
            res.status(500).send('Error al subir la imagen');
        }
    });
}

export { backendProducts };