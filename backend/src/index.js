import "dotenv/config";

import { app } from "./app"
import { sequelize } from "./models";


async function start() {
    const PORT = process.env.PORT || 8000;

    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // Uncomment to sync database
        // await sequelize.sync({ alter: true, force: false });
        // console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }

    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT} ...`);
    });
}

start();
