const express=require('express')
const router=new express.Router()
const multer=require('multer')
const sharp=require('sharp')
const Task = require('../models/task')
const User=require('../models/user')
const auth=require('../middleware/auth')
const {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')

//creating user
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try {
      await user.save()
      sendWelcomeEmail(user.email,user.name)
      const token= await user.generateAuthToken()
      
      res.status(201).send({user,token})
    } catch (error) {
      res.status(400).send(error)
    }
  })

  // route for loggin up
  router.post('/user/login', async (req,res)=>{
    try {
      const user= await User.findByCredentials(req.body.email, req.body.password)
      const token=await user.generateAuthToken()
      res.send({user,token})
      
    } catch ( e) {
      res.status(400).send(e.message)
    }
  })
  //logout
  router.post('/user/logout',auth,async(req,res)=>{
    try {
      req.user.tokens=req.user.tokens.filter((token)=>{
        return token.token!=req.token
      })
      await req.user.save()
      res.send()
    } catch (e) {
      res.status(500).send()
    }
  })
   //logout all session
   router.post('/user/logoutall',auth,async(req,res)=>{
    try {
     req.user.tokens=[]
     req.user.save()
     res.send()
    } catch (e) {
      res.status(500).send()
    }
  })

  // find all user
  router.get('/users/me',auth,async(req,res)=>{
res.send(req.user)
  })


  //update user
  router.patch('/users/me',auth,async(req,res)=>{

    const updates=Object.keys(req.body)
    const allowedKeys=['name','email','password']
   
    const isValidOperation=updates.every((update)=>allowedKeys.includes(update))
  
    if(!isValidOperation){
      res.status(400).send({Error:'Invalid Fields'})
    }
    try {
    
      updates.forEach((update)=>req.user[update]=req.body[update])
      
      await req.user.save()
      res.send(req.user)
      
    } catch (error) {
      res.status(400).send(error)
    }
  })

  //Delete one user
  router.delete('/users/me',auth,async(req,res)=>{
    try {
      await req.user.remove()
      sendCancellationEmail(req.user.email, req.user.name)
      res.send(req.user)
    } catch (error) {
      res.status(500).send(error)
    }
  })

//upload avatar
const upload=multer({
  
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.jpg|png|jepg/)){
      return cb(new Error('please upload an image'))
    }
    cb(undefined,true)

  }
 })
router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
  const buffer=await sharp(req.file.buffer).resize(250,250).png().toBuffer()
  req.user.avatar=buffer
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({Error:error.message})
})

//delete user profile image
router.delete('/user/me/deleteProfile',auth,async(req,res)=>{
  req.user.avatar=undefined
  await req.user.save()
  res.send()
})

//getting user profile image
router.get('/user/:id/avatar',async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
      throw new Error('no such profile')
    }
    res.set('content-type','image/png')
    res.send(user.avatar)

  } catch (error) {
    res.status(404).send()
  }
})
  
  module.exports=router