require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const schema = require('./schema/schema');

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch(err => console.log(`Failed to connect to database. Error: ${err}`));

//Fix for graphiql not loading: https://github.com/graphql/graphql-playground/issues/1283#issuecomment-875452321
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  })
);
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(compression());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
