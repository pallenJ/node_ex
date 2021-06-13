const express = require("express")
const app = express()
const port = 3500
const INFO = require("./info.json")
const log = require('log4js').getLogger();
log.info(INFO.serverURL);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))