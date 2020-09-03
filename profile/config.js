module.exports = {
    
    uriBase: "https://kafka.somewhere.net/profile",
    root: "/profile",
    secret: "some-long-secret-string",

    keycloak: {
        "realm": "tla",
        "auth-server-url": "https://auth.somewhere.net",
        "ssl-required": "none",
        "resource": "some-client",
        "public-client": true,
        "confidential-port": 0
    },

    lrsPool: [
        {
            user: "lrs-user",
            pass: "some-password",
            endpoint: "https://lrs.somewhere.net/xAPI/"
        },
        {
            user: "default",
            pass: "some-extra-long-password",
            endpoint: "https://fancy-lrs.somewhere.net/xapi/"
        }
    ],
    
    retryMS: 5000,
}