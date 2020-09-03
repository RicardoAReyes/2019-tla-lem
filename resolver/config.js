module.exports = {
    
    root: "/resolver",

    cacheExpirationMS: 10000,

    xi: {
        endpoint: "https://activities.somewhere.net/"
    },

    kafka: {
        config: {
            brokers: (process.env.KAFKA_BROKER || [
                "kafka.somewhere.net:19092",
                "kafka.somewhere.net:29092",
                "kafka.somewhere.net:39092"
            ].join(",")),
            saslUser: (process.env.KAFKA_SASL_USER || "some-kafka-user"),
            saslPass: (process.env.KAFKA_SASL_PASS || "some-kafka-pass"),
            consumerGroup: "resolver-will_be_duplicated_by_orlando_4head",
            topics: ["resolve-pending"],
        },

        // Whether or not to start our consumer at the earliest possible offset,
        // this might cause serious performance issues 
        readAll: false,
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
}