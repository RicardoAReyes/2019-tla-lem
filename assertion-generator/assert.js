const mom = require("tla-mom-proto")

module.exports = {
    verb: mom.verbs.asserted,
    object: {
        id: "",
        definition: {
            type: mom.activityTypes.competency,
            name: {
                "en-US": ""
            },
            description: {
                "en-US": ""
            }
        }
    },
    context: {
        extensions: {
            [mom.contextExtensions.evidence]: [],
            [mom.contextExtensions.confidence]: 0
        }
    }
};