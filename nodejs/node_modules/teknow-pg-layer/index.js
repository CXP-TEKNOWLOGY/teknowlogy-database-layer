'use strict';
const pgp = require('pg-promise')();

module.exports = class DataBase {
    constructor(connectionConfig) {
        this.connectionConfig = connectionConfig;
        this.open();
    }
    async close() {
        await pgp.end();
    }

    open() {
        this.connection = pgp(this.connectionConfig);
    }
  
    async runSQL(sql) {
        return this.connection[sql.match("SELECT") ? "query" : "execute"](sql);
    }

    async tekQuery(sqlQuery){
        return this.connection.query(sqlQuery)
    }
    /*
    async query(table, columns = "*" || [], rows = "*" || [], options = "*" || []) {
        const makeArray = str => typeof str === "string" && str !== "*" ? [str] : str;
        rows = makeArray(rows);
        options = makeArray(options);
        const SQLRows = rows === "*" ? "" : "ID=" + rows.join(" OR ");
        const SQLoptions = options === "*" ? "" : " AND " + options.join(" AND ");
        return this.runSQL(`SELECT ${makeArray(columns).join(",")} FROM [${table}] ${rows === "*" && options === "*"? "" : "WHERE"} ${SQLRows}${SQLOptions};`);
    }
    */
};