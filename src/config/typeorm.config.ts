import { ConnectionOptions } from 'typeorm';

export const options: ConnectionOptions = {
    type: 'postgres',
    host: 'suleiman.db.elephantsql.com',
    port: 5432,
    username: 'siqcnwve',
    password: 'GqXWqHumyR0h9fDXN0RcqqqT3tM1T55D',
    database: 'siqcnwve',
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: true,
}