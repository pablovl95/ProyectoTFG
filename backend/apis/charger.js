import fs from 'fs';

function backendCharger(app, db) {
    app.get('/deletedTables', async (req, res) => {
        try {

            let deleted = fs.readFileSync('./sql/deleted_tables.sql').toString();
            const deletedQueries = deleted.replace(/(\r\n|\n|\r)/gm, '').split(';').filter(query => query.length > 0);
            deletedQueries.forEach(async (query) => {
                await db.execute(query + ";");
            });
            res.send('Database charged successfully.');
        } catch (err) {
            console.error('Error charging database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/chargerTables', async (req, res) => {
        try {
            let sql = fs.readFileSync('./sql/database.sql').toString();
            const queries = sql.replace(/(\r\n|\n|\r)/gm, '').split(';').filter(query => query.length > 0);

            queries.forEach(async (query) => {
                await db.execute(query + ";");
            }
            );
            res.send('Database charged successfully.');
        } catch (err) {
            console.error('Error charging database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/chargerData', async (req, res) => {
        try {
            let sql = fs.readFileSync('./sql/data.sql').toString();
            const queries = sql.replace(/(\r\n|\n|\r)/gm, '').split(';').filter(query => query.length > 0);
            console.log(queries);
            queries.forEach(async (query) => {
                await db.execute(query + ";");
            }
            );
            res.send('Database charged successfully.');
        } catch (err) {
            console.error('Error charging database:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    app.get('/chargerTriggers', async (req, res) => {
        try {
            let sql = fs.readFileSync('./sql/triggers.sql').toString();
            const queries = sql.replace(/(\r\n|\n|\r)/gm, '').split(';').filter(query => query.length > 0);
            const newqueries = queries.map(async query =>
                await db.execute(`${query};`)
            );
            // queries.forEach(async (query) => {
            //     await db.execute(query + ";");
            // }
            // );
            res.send('Database charged successfully.');
        } catch (err) {
            console.error('Error charging database:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/chargerFunctions', async (req, res) => {
        try {
            await db.execute(
                `
CREATE TRIGGER UpdateProductRatingAndComments
AFTER INSERT ON Reviews
FOR EACH ROW
BEGIN
    UPDATE Products
    SET Rating = (SELECT AVG(AssignedRating) FROM Reviews WHERE ProductID = NEW.ProductID),
        TotalComments = (SELECT COUNT(*) FROM Reviews WHERE ProductID = NEW.ProductID)
    WHERE ProductID = NEW.ProductID;
END;
                `
            );
            res.send('Database charged successfully.');
        } catch (err) {
            console.error('Error charging database:', err);
            res.status(500).send('Internal Server Error');
        }
    });
}


export { backendCharger };
