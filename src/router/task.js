const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

// creating task
router.post('/tasks',auth,async(req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
      ...req.body,
      owner:req.user._id
    })
    
    try {
      await task.save()
      res.status(201).send(task)
      
    } catch (error) {
      res.status(400).send(error)
    }
})
//find all task
router.get('/tasks',auth, async(req,res)=>{
try {
  const match={}
  const sort={}

  if(req.query.completed){
    match.completed=req.query.completed==='true'
  }
  if(req.query.sortBy){
    const parts=req.query.sortBy.split(':')
    sort[parts[0]]=parts[1]==='desc' ? -1 : 1
  }
  const tasks=await req.user.populate({
    path:'tasks',
    match,
    options:{
      limit:parseInt(req.query.limit),
      skip:parseInt(req.query.skip),
      sort
    }
  })

  res.send(req.user.tasks)

} catch (error) {
  res.send(error)
}
})

// find one task by its id
router.get('/tasks/:id',auth,async(req,res)=>{
  const  _id=req.params.id
  try {
   //const task= await Task.findById(_id)
   const task=  await Task.findOne({_id, owner:req.user._id})
   if (!task) {
    return res.status(400).send('Task Not Found')
   }
   
   res.status(200).send(task)
  } catch (error) {
    res.status(500).send(error)
  }

})


// update one task
router.patch('/tasks/:id',auth, async(req,res)=>{
  const keys=Object.keys(req.body) 
  const allowedKeys=['task','completed']
  const isValidOperation=keys.every((key)=> allowedKeys.includes(key)) 
  if(!isValidOperation){
    res.status(400).send({Error:'Invalid Fields!'})
  }
  try {
    const task= await Task.findOne({_id:req.params.id,owner:req.user._id})
  
    if (!task) {
      return res.status(404).send()      
    }
    keys.forEach((key) => task[key]=req.body[key]);
    await task.save()

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})


//delete one task
router.delete('/tasks/:id',auth,async(req,res)=>{
  try {
    const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
    if(!task){
      res.status(400).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})
module.exports=router