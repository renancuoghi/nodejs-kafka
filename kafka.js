
const { Kafka } = require("kafkajs")
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();

// base class
class KafkaBase {
    constructor(clientId, brokers) {        
        this.Kafka = new Kafka({ clientId, brokers }); 
    }

    getKafkaClient() {
        return this.Kafka;
    }

    createMessage( value, key){
        // if it doesn't have a key gen a uuid key token
        if(!key){
            key = tokgen.generate();
        }
        return {
            key: key,
            value: value.toString()
        };
    }

}

// kafka producer
class KafkaProducer extends KafkaBase {
    constructor(clientId, brokers) {
        super(clientId, brokers);
        this.producer = this.Kafka.producer();
    }

    // function to send message to kafka topic
    async send(topic, messages) {
        await this.producer.connect();        
        this.producer.send({
            topic,
            messages: messages
        });
    }
}

// kafka consumer
class KafkaConsumer extends KafkaBase {
    constructor(clientId, brokers) {
        super(clientId, brokers);
        this.consumer = this.Kafka.consumer({ groupId : clientId});
    }

    // consume message from kafka topic
    async consume(topic, callback) {
        await this.consumer.connect();        
        // listenning topic
        await this.consumer.subscribe({ topic });
        // run is executed every time the consumers gets a message
        await this.consumer.run({
            eachMessage: ({ message }) => callback(message)
        });
    }
}

module.exports = {KafkaProducer, KafkaConsumer};