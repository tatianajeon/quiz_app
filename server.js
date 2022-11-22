const { userData } = require('./src/middleware/userData')
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/db')
const { graphqlHTTP } = require('express-graphql')
// Import our GraphQL Schema
const schema = require('./src/graphql/schema')
const { authenticate } = require('./src/middleware/auth')
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

// connecting MongoDB
connectDB()


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

// set the view engine to ejs
app.set('view engine', 'ejs');

// update location of views folder that res.render pulls from
app.set('views', path.join(__dirname, '/src/templates/views'));

app.use(authenticate)

/* Initialize Routes */
require("./src/routes")(app)


app.use(express.urlencoded({ extended: true }))
app.use(userData)
// request and response
app.get('/', (req, res) =>{
    res.send('Hello World of Quizzes')
})
app.use(cookieParser())


app.listen(process.env.PORT, () => {
    console.log(`Server now running on PORT: ${process.env.PORT}`)
});

