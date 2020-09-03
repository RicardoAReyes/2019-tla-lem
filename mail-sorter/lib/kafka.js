const mom = require("tla-mom-proto");
const kafkaConsumer = require("simple-kafka-consumer");
const kafkaProducer = require("simple-kafka-producer");

const config = require("../config");
const filters = require("./filters")

module.exports = {

    /**
     * Callback to pass authoritative statements back.
     * @callback onAuthorityCallback
     * @param {Object} statement - The authoritative xAPI statement.
     */

    /**
     * Instruct the Kafka adapters to filter and relay authoritative xAPI.
     * @param {onAuthorityCallback} callback - Callback passing any authoritative statements.
     */
    filter(callback) {

        // The consumer requirements are an unused superset of the producer version, so
        // we can just use the same for each.
        //
        const kafkaConfig = {
            brokers: (process.env.KAFKA_BROKER || config.kafka.brokers.join(",")),
            saslUser: (process.env.KAFKA_SASL_USER || config.kafka.sasl.username),
            saslPass: (process.env.KAFKA_SASL_PASS || config.kafka.sasl.password),
            consumerGroup: config.kafka.consumerGroup,
            topics: ["learner-xapi"],
        }

        const produce = (statement, topic) => {
            kafkaProducer.produceMessage(topic, statement);
            callback(statement, topic);
        }

        kafkaProducer.configure(kafkaConfig)
        kafkaConsumer.configure(kafkaConfig)
        
        kafkaProducer.initProducer()
        kafkaConsumer.initConsumer((topic, offset, message) => {

            let statement = null;
            try {
                statement = JSON.parse(message);
            } catch (err) {
                return console.error("[Mail] Statement Parsing Error: ", topic, offset, message)
            }

            if (!statement.verb)
                return

            if (filters.isAuthoritative(statement)) 
                produce(statement, "authority-xapi")

            else if (filters.isResolution(statement))
                produce(statement, "resolved-xapi")

            else if (filters.needsResolution(statement)) 
                produce(statement, "resolve-pending")

            else if (filters.isRelevant(statement))
                produce(statement, "resolved-xapi")

            else
                console.log("nothing for:", statement.verb)
        })
    }
}

