require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 3000;
const routes = require('./src/http/route/route');
const CORSMiddleware = require('./src/http/middleware/CORS.middleware');
const responseMiddleware = require('./src/http/middleware/response.middleware');

const env = require('dotenv');
env.config();
console.log(process.env.NODE_ENV)


app.use(CORSMiddleware);
app.use(express.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.set('json spaces', 2)

app.use('/api', routes);

app.use(responseMiddleware);

app.get('/helloworld', (req, res) => {
  res.send('Hello World!')
});

app.listen(process.env.PORT, () => {
  console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});