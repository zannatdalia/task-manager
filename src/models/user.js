const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('../models/task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required : true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail){
                throw new Error('This is an invalid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase()==="password"){
                throw new Error('password can not contain password')
            }
        }
       
    },
    age:{
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('age must be positive')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true}
        
    }],
    avatar:{
        type:Buffer
    }
    
},{
    timestamps:true
})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//hiding credential from user
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//generating token
userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}


// login
userSchema.statics.findByCredentials= async(email, password)=>{
    const user = await User.findOne({email:email})
        if(!user){
            //console.log('found no user');
         throw new Error('found no such user')
    }
    const isMatch=await bcrypt.compare(password, user.password)
    if(!isMatch){
        //console.log('incorrect password');
        throw new Error('incorrect password')
    }
    return user
}

// hashing  password
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//removing tasks 
userSchema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User= mongoose.model('User',userSchema)

module.exports=User