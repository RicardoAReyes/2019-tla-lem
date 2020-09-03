module.exports = {
    
    root: "/scheduler",
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
        consumerGroup: "task-tracker",

        // Whether or not to start our consumer at the earliest possible offset;
        // this might cause serious performance issues.
        readAll: false,
    },

    lrs: {
        user: (process.env.LRS_USER || "default"),
        pass: (process.env.LRS_PASS || "some-extra-long-password"),
        endpoint: (process.env.LRS_ENDPOINT || "https://fancy-lrs.somewhere.net/xapi/")
    },
}