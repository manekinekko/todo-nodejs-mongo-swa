import { AppConfig } from "./appConfig";
import * as dotenv from "dotenv";
import { configureMongoose } from "../models/mongoose";

const getConfig: () => Promise<AppConfig> = async () => {
    // Load any ENV vars from local .env file
    if (process.env.NODE_ENV !== "production") {
        dotenv.config();
    }

    return {
        observability: {
            connectionString: process.env.REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING,
            roleName: process.env.REACT_APP_APPLICATIONINSIGHTS_ROLE_NAME,
        },
        database: {
            connectionString: process.env.DATABASE_CONNECTION_STRING,
            databaseName: process.env.DATABASE_NAME,
        },
    };
};

// Hello Java!
export async function initializeConfiguration() {

    const config = await getConfig();
    await configureMongoose(config.database);

}