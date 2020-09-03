module.exports = {

    root: "/experience",

    ContentSetURI: "/contentset",

    proxyURL: "https://activities.somewhere.net",

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