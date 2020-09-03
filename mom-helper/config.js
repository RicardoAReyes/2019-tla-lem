module.exports = {
    
    uriBase: "https://kafka.somewhere.net/mom",
    root: "/mom",
    secret: "some-long-secret-string",

    keycloak: {
        "realm": "tla",
        "auth-server-url": "https://auth.somewhere.net",
        "ssl-required": "none",
        "resource": "some-client",
        "public-client": true,
        "confidential-port": 0
    },

    lrs: {
        user: (process.env.LRS_USER || "lrs-user"),
        pass: (process.env.LRS_PASS || "some-password"),
        endpoint: (process.env.LRS_ENDPOINT || "https://lrs.somewhere.net/xAPI")
    },
    
    retryMS: 5000,
}