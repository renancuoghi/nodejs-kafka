const config = require('./config.json');
const express = require('express');
const bodyParser = require('body-parser');
const kafkaClient = require('./kafka');

// starting consumers
const consumers = require('./kafka-consumers');


const kafkaProducer = new kafkaClient.KafkaProducer(config.kafkaClientId, config.kafkabrokers);


const app = express();

app.use(bodyParser.json());

app.get("/iseven", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');     
    if(req.query.number && isNaN(req.query.number) === false){
        // create a uuid key token
        const message = kafkaProducer.createMessage(req.query.number);
        await kafkaProducer.send(config.calculateTopic, [message]);
        res.json({'message' : 'message sent to queue!!'});
    }else{
        res.status(500).json({'message' : 'Invalid parameter.'});
    }
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});




