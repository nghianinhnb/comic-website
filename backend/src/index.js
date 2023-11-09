import "dotenv/config";

import { app } from "./app"
import { sequelize } from "./models";


async function start() {
    const PORT = process.env.PORT || 8000;

    await sequelize.authenticate()
        .then(() => console.log('Connected to database.'))
        .catch((error) => console.error("Unable to connect to the database:", error))

    // Uncomment to sync database
    // await sequelize.sync({ alter: true, force: false });
    // console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT} ...`);
    });
}

start();
