module.exports = {

    root:   "/mobile",
    
    secret: "some-long-secret-string",

    arrm:           "https://activities.somewhere.net/exexperience",
    authHelper:     "https://auth.usalearning.net/helper/api/users",
    dave:           "https://content.somewhere.net/dave/",
    lp:             "https://kafka.somewhere.net/profile/api",
    scheduler:      "https://kafka.somewhere.net/scheduler/tasks",
    vlrc:           "https://content.somewhere.net/cass-vlrc/index.html?frameworkId=https://cass.somewhere.net/api/data/schema.cassproject.org.0.4.Framework/cad6ea4d-d82f-4b8e-9afe-011df2dca922&server=https://cass.somewhere.net/api/",

    lrs: {
        user:       (process.env.LRS_USER || "default"),
        pass:       (process.env.LRS_PASS || "some-extra-long-password"),
        endpoint:   (process.env.LRS_ENDPOINT || "https://fancy-lrs.somewhere.net/xapi/")
    },

    xapi: {
        baseURI:    "https://auth.somewhere.net"
    },

    keycloak: {
        "realm": "tla",
        "auth-server-url": "https://auth.somewhere.net",
        "ssl-required": "none",
        "resource": "some-client",
        "public-client": true,
        "confidential-port": 0
    },

    LearningExperience: {
        Titles: {
            uuid: "UUID",
            handle: "URI",
            description: "Description",
            contentlist: "ContentList",
            context: "Context",
            educationalalignment: "EducationalAlignment"
        },

        URL: 'activities.somewhere.net'
    }, 

    LearnerProfile: {
        Titles: {
            id: "ID",
            uuid: "UUID",
            handle: "Handle",
            uxRoles: "UXRoles",
            learnerState: "LearnerState",
            goals: "Goals",
            competencies: "Competencies",
            tasks: "Tasks"
        }
    },

    retryMS: 5000
}
