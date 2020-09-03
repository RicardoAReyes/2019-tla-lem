module.exports = {
    
    root: "/generator",

    cacheExpirationMS: 60000,

    kafka: {
        brokers: [
            "kafka.somewhere.net:19092",
            "kafka.somewhere.net:29092",
            "kafka.somewhere.net:39092"
        ],
        topics: [
            "resolved-xapi"
        ],
        sasl: {
            mechanism: 'plain', 
            username: "some-kafka-user", 
            password: "some-kafka-pass" 
        },
        consumerGroup: "cass-generator",

        // Whether or not to start our consumer at the earliest possible offset,
        // this might cause serious performance issues 
        readAll: false,
    },

    cassHelper: {
        competencyEndpoint: "https://cass.somewhere.net/helper/api/competencies"
    },
    
    lrs: {
        user: (process.env.LRS_USER || "lrs-user"),
        pass: (process.env.LRS_PASS || "some-password"),
        endpoint: (process.env.LRS_ENDPOINT || "https://lrs.somewhere.net/xAPI/")
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
