const express=require('express')
require('./db/mongoose')
const { default: mongoose } = require('mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')

const app=express()
const port=process.env.PORT


const multer=require('multer')
const upload=multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log('server is up on port'+ port);
})

