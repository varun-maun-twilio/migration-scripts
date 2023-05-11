require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


async function updateWorkerCapacities(){
    const wList= await client.taskrouter.v1.workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
    .workers
    .list({limit: 1000})
    
    for(let worker of wList){

       await client.taskrouter.v1.workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
        .workers(worker.sid)
        .workerChannels('sms')
        .update({capacity: 50})

        console.log(`Updated capacity for ${worker.friendlyName} `);

    }

}


async function updatePhoneNumberWebhooks(){
    const nList = await  client.incomingPhoneNumbers.local.list({limit:1000});

    for(let p of nList){
        await client.incomingPhoneNumbers(p.sid)
        .update({smsUrl: process.env.SMS_WEBHOOK_URL})

        console.log(`Updated webhook for  ${p.phoneNumber} `);
    }

}


async function main(){
    await updateWorkerCapacities();
    await updatePhoneNumberWebhooks();

}






main();