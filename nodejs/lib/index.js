'use strict';
const pgp = require('pg-promise')();
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

module.exports = class DataBase {
    constructor() {
        this.connectionConfig;
        this.connection;         
    }
    async close() {
        await pgp.end();
    }

    async open() {
        this.connectionConfig = await getDbParameters();
        console.log(this.connectionConfig)
        this.connection = await pgp(this.connectionConfig);
        console.log(this.connection)
    }
  
    async runSQL(sql) {
        return this.connection[sql.match("SELECT") ? "query" : "execute"](sql);
    }

    async tekQuery(sqlQuery){
        console.log('DB LAYER this.connection')
        console.log(this.connection)
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

const getDbParameters = async () => {
    let req = {
        Names: [ '/DEV/PGHOST', '/DEV/PGPORT', '/DEV/PGDATABASE', '/DEV/PGUSER', '/DEV/PGPASSWORD'  ],
        WithDecryption: true
    }

    let resp = await ssm.getParameters(req).promise()

    let mapping = {
        "/DEV/PGHOST" : "host",
        "/DEV/PGPORT" : "port",
        "/DEV/PGDATABASE" : "database",
        "/DEV/PGUSER" : "user",
        "/DEV/PGPASSWORD" : "password",

    }

    let params = {}
    for (let p of resp.Parameters) {
        mapping
        params[mapping[p.Name]] = p.Value
        if(p.Name == '/DEV/PGPORT') params[mapping[p.Name]] = parseInt(p.Value)
    }
    console.log(params)
    return params
}