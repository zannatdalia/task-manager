const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Connection Failed');
    }

    const db=client.db(databaseName)

//     db.collection('users').insertOne({
//         name:'Hasan',
//         age:27
//     },(error,result)=>{
//         if(error){
//             return console.log('failed to insert data');
//         }
//         console.log(result.ops);
//     })


//     db.collection('tasks').insertMany([
//         {
//             description:'coding by following tutorial',
//             completed:true

//         },{
//             description:'Dinner at 11:30 pm',
//             completed:false
//         },{
//             description:'go to bed at 12:00 pm',
//             completed:false
//         }
//     ]),(error, result)=>{
//         if (error) {
//             return console.log('failed to insert');
//         }
//         console.log(result.ops);
//     }


// // db.collection('users').findOne({name:'Zannat'},(error,user)=>{

// //     if (error) {
// //        return console.log('failed');
// //     }
// //     console.log(user);
// // })

// //finding last element of task
// // db.collection('tasks').findOne({_id: new mongodb.ObjectId("62ea4d8ae78f361debaf7b38") },(error,task)=>{
// //     if (error) {
// //         return console.log(failed);
// //     }
// //     console.log(task);
// // })

// // //finding all incompletted elements
// // db.collection('tasks').find({completed:false}).toArray((error,task)=>{
// //     console.log(task);
// // })

// // //updating data
// // db.collection('users').updateOne({_id:new mongodb.ObjectId("62e95ddd15215bb93480240c")},{
// //     $set:{
// //         name:'Sazid'
// //     }
// // }).then((result)=>{
// //     console.log(result);
// // }).catch((error)=>{
// //     console.log(error);
// // })

// //updatemany
// db.collection('tasks').updateMany({completed:false},{
//     $set:{
//         completed:true
//     }
// }).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })



 })