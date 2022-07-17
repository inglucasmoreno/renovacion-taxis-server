import { createPool, createConnection } from 'mysql2/promise';

export async function connect() {
    console.log('conectando');
    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        database: 'identificador_vehicular',
    });
    return connection;    
} 