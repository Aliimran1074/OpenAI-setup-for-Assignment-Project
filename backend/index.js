require('dotenv').config()
const express= require('express')
const app= express()
const cors= require('cors')
// const { showApiKey } = require('./API Setup Routes/setup')
const port = process.env.Port
const contentGenerator= require('./Router/TextGeneratorRoutes/textGeneratorRoute')


app.use(cors())
app.use(express.json())
app.use('/setup',contentGenerator)
app.listen(port,()=>{
console.log("App listen on port ",port)
// showApiKey()
})
console.log('Ali Imran')

