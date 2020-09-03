module.exports = {
    
    root: "/goals",
    secret: "some-long-secret-string",

    keycloak: {
        "realm": "tla",
        "auth-server-url": "https://auth.somewhere.net",
        "ssl-required": "none",
        "resource": "some-client",
        "public-client": true,
        "confidential-port": 0
    },
    
    retryMS: 5000,

    kafka: {
        brokers: [
            "kafka.somewhere.net:19092",
            "kafka.somewhere.net:29092",
            "kafka.somewhere.net:39092"
        ],
        topics: [
            "test-1",
            "test-2",
            "test-3",
            "learner-xapi",
            "system-xapi"
        ],
        sasl: {
            mechanism: 'plain', 
            username: "some-kafka-user", 
            password: "some-kafka-pass" 
        },
        consumerGroup: "goal-tracker",

        // Whether or not to start our consumer at the earliest possible offset;
        // this might cause serious performance issues.
        readAll: false,
    },
}