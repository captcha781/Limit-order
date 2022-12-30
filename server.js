require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const mainRoutes = require("./routes/index")


const app = express()

app.use(morgan("dev"))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())



app.use("/", mainRoutes)



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