module.exports = {
    
    root: "/monitor",

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
            "authority-xapi",
            "learner-xapi",
            "system-xapi",
            "goals",
            "tasks",
            "resolve-pending",
            "resolved-xapi"
        ],
        sasl: {
            mechanism: 'plain', 
            username: "some-kafka-user", 
            password: "some-kafka-pass" 
        },
        consumerGroup: "kafka-monitor",

        // Whether or not to start our consumer at the earliest possible offset,
        // this might cause serious performance issues 
        readAll: false,
    },

    keycloak: {
        "realm": "tla",
        "auth-server-url": "https://auth.somewhere.net",
        "ssl-required": "none",
        "resource": "some-client",
        "public-client": true,
        "confidential-port": 0
    },

    retryMS: 5000,
}