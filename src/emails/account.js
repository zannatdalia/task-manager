const sgMail=require('@sendgrid/mail')
//const sendGridIDAPIkKey='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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'zannatdalia@gmail.com',
        subject:'Thanks for joining in!',
        text:'Welcome to app,${name}.Let me know how you get along with the app'
    })
}

const sendCancellationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'zannatdalia@gmail.com',
        subject:'Sorry to see you go!',
        text:'Goodbye,${name}.I hope to see you back sometime soon'
    })
}


module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}

