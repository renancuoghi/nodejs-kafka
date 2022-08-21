
const kafkaClient = require('./kafka');
const config = require('./config.json');
const fs = require('fs');
const dayjs = require('dayjs');
/**
 * it wasn't possible consume and produce with same kafkaClientId in differents topcs, so you have to initialize with a espefic clientId for each topic
 */
const KafkaConsumer = new kafkaClient.KafkaConsumer(config.kafkaClientId, config.kafkabrokers);
// producer and consumer for Even
const kafkaProducerEven = new kafkaClient.KafkaProducer(config.kafkaEvenClientId, config.kafkabrokers);
const KafkaConsumerEven = new kafkaClient.KafkaConsumer(config.kafkaEvenClientId, config.kafkabrokers);
// producer and consumer for Odd
const kafkaProducerOdd = new kafkaClient.KafkaProducer(config.kafkaOddClientId, config.kafkabrokers);
const KafkaConsumerOdd = new kafkaClient.KafkaConsumer(config.kafkaOddClientId, config.kafkabrokers);


const logMessage = (queueFile, message, topic) => {
    console.log(`Consuming ${topic}`);
    console.log(`${message.key}: ${message.value}`);    
    console.log("==============================================");   
    const eventDate  = dayjs();
    const row = `${eventDate.format()} key: ${message.key} number: ${message.value} \r\n`;
    fs.appendFile(queueFile, row, function (err) {
        if(err){
            console.log(err.message);
        }
    });
}


KafkaConsumer.consume(config.calculateTopic, (message) => {
    const key = message.key;
    const value = message.value;
    console.log(`Consuming ${config.calculateTopic}`);
    console.log(key + " - " + value);
    
    const number = parseInt(value);
    const newmessage = kafkaProducerEven.createMessage(value, key);
    if(number % 2 == 0){
        console.log(`${value} is even, sent to even topic`);
        kafkaProducerEven.send(config.evenTopic, [newmessage]);
    }else{
        console.log(`${value} is odd, sent to odd topic`);
        kafkaProducerOdd.send(config.oddTopic, [newmessage]);
    }
    console.log("==============================================");
});


KafkaConsumerEven.consume(config.evenTopic, (message) =>  logMessage(config.evenFile, message, config.evenTopic));

KafkaConsumerOdd.consume(config.oddTopic, (message) => logMessage(config.oddFile, message, config.oddTopic));


