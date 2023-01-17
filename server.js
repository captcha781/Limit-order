require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')


const mainRoutes = require("./routes/index")
const limitRoutes = require("./routes/limits")


const app = express()


app.use(morgan("dev"))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(passport.initialize())
require('./authentication/passport').users(passport);

app.use("/", mainRoutes)
app.use("/exchange", limitRoutes)
require("./jobs/orderCron")()
require("./jobs/spotCron")()
require("./jobs/transactcron")()
require('./config/Web3Contract')()

mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
        console.log(err);
        process.exit()
    }
    app.listen(process.env.PORT, (err) => {
        if (err) {
            console.log(err);
            process.exit()
        }
        console.log(`Server runs on port ${process.env.PORT}`);
    })
})