// import mysql from "mysql2/promise"

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10
// })

// export default db;


import mysql from "mysql2/promise";

// Singleton: evita crear un pool nuevo en cada hot-reload de Next.js
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const db =
  global._mysqlPool ??
  mysql.createPool({
    host:             process.env.DB_HOST,
    port:             Number(process.env.DB_PORT) || 3306,
    user:             process.env.DB_USER,
    password:         process.env.DB_PASSWORD,
    database:         process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:  10,
    connectTimeout:   10_000,   // 10 s antes de ETIMEDOUT
    namedPlaceholders: false,
  });

if (process.env.NODE_ENV !== "production") global._mysqlPool = db;

export default db;