const axios = require("axios").default
const cache = require("./cache")
const config = require("../config")

module.exports = {

    /**
     * @typedef Competency CaSS-defined competency definition.
     * @property {string} id Competency URI.
     * @property {string} name Human-readable name.
     * @property {string} description Human-readable description.
     * @property {string|null} parent URI of a parent competency, if any.
     * @property {string[]} children Array of URIs for child competencies.
     */
    /**
     * Returns the CaSS-defined competency object for this URI.
     * @param {string} competencyURI URI of the competency to query.
     * @return {Competency} Competency definition as defined in CaSS.
     */
    getCompetencyDefinition: async (competencyURI) => {

        try {
            if (!cache.isCached(competencyURI)) {
                let res = await axios.get(config.cassHelper.competencyEndpoint + `?id=${competencyURI}`)
                cache.set(competencyURI, res.data)
            }

            return cache.get(competencyURI)
        }
        catch (error) {
            console.error(`[CASS Retrieval] Error querying for ${competencyURI}:`, error.status)
            return null
        }
    }
}