import { getConnectionManager, Connection } from "typeorm";
import { options } from "./typeorm.config";

export class SqlConneciton{
    static getConnection(): Connection{
        const connectionManager = getConnectionManager();
        const connection = connectionManager.create(options);
        return connection;
    }
}