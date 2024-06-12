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
CREATE TRIGGER UpdateOrderStatus
AFTER UPDATE OF OrderStatus ON OrderProducts
FOR EACH ROW
BEGIN

    INSERT INTO OrdersStatus (
        OrderProductsID,
        OrderStatus,
        OrderStatusDate,
        OrderStatusFinalDate
    ) VALUES (
        NEW.OrderProductsID,
        NEW.OrderStatus,
        NEW.OrderDate,
        NULL
    );
        UPDATE OrdersStatus
        SET OrderStatusFinalDate = CURRENT_TIMESTAMP
        WHERE OrderProductsID = NEW.OrderProductsID AND OrderStatus = OLD.OrderStatus;
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
