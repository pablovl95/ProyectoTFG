function backendShops(app, db) {


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

}

export { backendShops };