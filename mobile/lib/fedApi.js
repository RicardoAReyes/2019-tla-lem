/**
 * Activity Index metamodel.
 *
 * OpenAPI spec version: 1.0.0
 *
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var url = require("url");
require('es6-promise').polyfill();
//require("isomorphic-fetch");
//var isomorphicFetch = require("isomorphic-fetch");
var nodeFetch = require("node-fetch");
var fetch = require("node-fetch");
var assign = require("core-js/library/fn/object/assign");
var BASE_PATH = "http://localhost";
//var BASE_PATH = "http://localhost:8080";
var BaseAPI = (function () {
    function BaseAPI(fetch, basePath) {
        //if (fetch === void 0) { fetch = isomorphicFetch; }
        if (basePath === void 0) { basePath = BASE_PATH; }
        this.basePath = basePath;
        this.fetch = nodeFetch;
    }
    return BaseAPI;
}());
exports.BaseAPI = BaseAPI;


// Added to get tasks/learner profile data.
exports.Tasks = {
    getTasks: function (URL) {
        let url = URL
        return function (url) {
            var fetchOptions = {
                method: "GET",
                protocol: "http://",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };

            ;
            /* https://kafka.somewhere.net/profile/me */
            return fetch(URL, fetchOptions).then(async function (response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response);
                    console.log(JSON.stringify(response));
                    return await response.text();
                }
                else {
                    console.log(response);
                    throw response;
                }
            }).catch((e) => { console.log(e); });
        };
    }

}

// Added to get competency for XI.
exports.Competency = {

    getSingleRecord: function (url) {

        console.log("url" + url)

        return function () {
            return fetch(url)
                .then(res => res.json())
                .then(res => { return res })
                .catch(e => { console.log(e) });
        };
    },

    getComps: async function () {
        let compList = {};

        /* let results = await fetch("https://cass.somewhere.net/api/data?size=10000&q=@type:%22Competency%22", {
            method: "get",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                console.log("Looks like that worked.");
                //console.log(response);
                return response.json();
            }
            else {
                console.log("Oops, looks like that that didn't work.");
                console.log(response);
                throw response;
            }
        })
            .catch((e) => { console.log(e) });

        //console.log(results);
        results.forEach((item) => {
            //console.log(item['name'] + " : " + item['@id']);
            compList[item['name']] = item['@id'];
        }); */

        let compLabels = [], compValues = [];

        /* for (let [key, value] of Object.entries(compList)) {
            compLabels.push(`${key} :: ${value}`);
            compValues.push(`${value}`);
        } */

        // Getting Slice of Codiac competencies from CaSS.
        let codiacResults = await fetch("https://cass.somewhere.net/api/data/schema.cassproject.org.0.4.Framework/cad6ea4d-d82f-4b8e-9afe-011df2dca922", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                console.log("Looks like that worked");
                console.log(response);
                return response.json();
            }
            else {
                console.log("Oops, looks like that that didn't work");
                console.log(response);
                throw response;
            }
        }).catch((e) => { console.log(e) });

        let compPromiseArray = [];
        // Getting competency name from each.
        codiacResults.competency.forEach((url) => {

            compPromiseArray.push(
                fetch(url, {
                    method: "GET", headers: { "Content-Type": "application/json" }
                }).then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Looks like that worked");
                        console.log(response);
                        return response.json();
                    }
                    else {
                        console.log("Oops, looks like that that didn't work");
                        console.log(response);
                        throw response;
                    }
                }).catch((e) => { console.log(e) })
            )
        });

        await Promise.all(compPromiseArray).then((compObjects) => {

            compObjects.forEach((compObject) => {
                //compLabels.push(`${compObject['name'][0]['@value']} :: ${compObject['@id']}`);
                compValues.push(`${compObject['@id']}`);
                compList[ compObject['name'][0]['@value'] ] = compObject['@id'];
            })

        }).catch((e) => { console.log(e) })

        return { compLabels: compList, compValues: compValues , compTree: codiacResults };
    }
}

/**
 * ActivityMetadataApi - fetch parameter creator
 */
//console.log("nodeFetch");
//console.log(nodeFetch);

exports.ActivityMetadataApiFetchParamCreactor = {

    /**
     * get all activity_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getActivities: function (params) {
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getActivities()");
        }
        var baseUrl = "/activities";
        var urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "limit": params.limit,
            "offset": params.offset,
        });
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },

    /**
     * Find activities by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getActivityByPropValue: function (params) {
        // verify required parameter "property" is set
        if (params["property"] == null) {
            throw new Error("Missing required parameter property when calling getActivityByPropValue");
        }
        // verify required parameter "value" is set
        if (params["value"] == null) {
            throw new Error("Missing required parameter value when calling getActivityByPropValue");
        }
        /* if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getActivityByPropValue");
        } */
        var baseUrl = "/activities/{property}/{value}"
            .replace("{" + "property" + "}", "" + params.property)
            .replace("{" + "value" + "}", "" + params.value);
        var urlObj = url.parse(baseUrl, true);
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },


    getActivityByComp: function (params) {
        // verify required parameter "property" is set
        if (params["comp"] == null) {
            throw new Error("Missing required parameter property when calling getActivityByPropValue");
        }
        var baseUrl = "/activities/{property}"
            .replace("{" + "property" + "}", "" + params.comp);

        var urlObj = url.parse(baseUrl, true);
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },
};
/**
 * ActivityMetadataApi - functional programming interface
 */
exports.ActivityMetadataApiFp = {
    /**
     * add an activity_metadata object into the Activity Index
     * Activity Metadata object that needs to be added
     * @param body Activity Metadata object
     */
    /**
     * get all activity_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getActivities: function (params) {
        var fetchArgs = exports.ActivityMetadataApiFetchParamCreactor.getActivities(params);
        return function () {
            //console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url); 
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else {
                    throw response;
                }
            }).catch((e) => { console.log(e); });
        };
    },

    /**
     * Find activities by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getActivityByPropValue: function (params) {
        var fetchArgs = exports.ActivityMetadataApiFetchParamCreactor.getActivityByPropValue(params);
        return function () {
            //console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response);
                    return response.json();
                }
                else {
                    console.log(response);
                    throw response;
                }
            }).catch((e) => { console.log(e); });
        };
    },

    /**
     * Find activities by competency uuid
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getActivityByComp: function (params) {
        var fetchArgs = exports.ActivityMetadataApiFetchParamCreactor.getActivityByComp(params);
        return function () {
            //console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response);
                    return response.json();
                }
                else {
                    console.log(response);
                    throw response;
                }
            }).catch((e) => { console.log(e); });
        };
    },
};
/**
 * ActivityMetadataApi - object-oriented interface
 */
var ActivityMetadataApi = (function (_super) {
    __extends(ActivityMetadataApi, _super);
    function ActivityMetadataApi() {
        _super.apply(this, arguments);
    }

    /**
     * get all activity_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    ActivityMetadataApi.prototype.getActivities = function (params) {
        return exports.ActivityMetadataApiFp.getActivities(params)(this.fetch, this.basePath);
    };

    /**
     * Find activities by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    ActivityMetadataApi.prototype.getActivityByPropValue = function (params) {
        return exports.ActivityMetadataApiFp.getActivityByPropValue(params)(this.fetch, this.basePath);
    };

    ActivityMetadataApi.prototype.getActivityByComp = function (params) {
        return exports.ActivityMetadataApiFp.getActivityByComp(params)(this.fetch, this.basePath);
    };

    return ActivityMetadataApi;
}(BaseAPI));
exports.ActivityMetadataApi = ActivityMetadataApi;
;
/**
 * ActivityMetadataApi - factory interface
 */
exports.ActivityMetadataApiFactory = function (fetch, basePath) {
    return {
        /**
         * get all activity_metadata objects from the Activity Index
         * @param limit The maximum number of objects that will be returned
         * @param offset Determines the first object to be returned
         */
        getActivities: function (params) {
            return exports.ActivityMetadataApiFp.getActivities(params)(fetch, basePath);
        },
        /**
         * Find activities by property:value
         * Returns Content matching this content
         * @param property property to search on
         * @param value value to search on
         */
        getActivityByPropValue: function (params) {
            return exports.ActivityMetadataApiFp.getActivityByPropValue(params)(fetch, basePath);
        },

        getActivityByComp: function (params) {
            return exports.ActivityMetadataApiFp.getActivityByComp(params)(fetch, basePath);
        },


    };
};
/**
 * ContentMetadataApi - fetch parameter creator
 */
exports.ContentMetadataApiFetchParamCreactor = {

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getAllContent: function (params) {
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getAllContent");
        }
        var baseUrl = "/content";
        var urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "limit": params.limit,
            "offset": params.offset,
        });
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        };
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }

        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },

    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getContentByPropValue: function (params) {
        // verify required parameter "property" is set
        if (params["property"] == null) {
            throw new Error("Missing required parameter property when calling getContentByPropValue");
        }
        // verify required parameter "value" is set
        if (params["value"] == null) {
            throw new Error("Missing required parameter value when calling getContentByPropValue");
        }
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getContentByPropValue");
        }
        var baseUrl = "/content/{property}/{value}"
            .replace("{" + "property" + "}", "" + params.property)
            .replace("{" + "value" + "}", "" + params.value);
        var urlObj = url.parse(baseUrl, true);
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },
};
/**
 * ContentMetadataApi - functional programming interface
 */
exports.ContentMetadataApiFp = {

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getAllContent: function (params) {
        var fetchArgs = exports.ContentMetadataApiFetchParamCreactor.getAllContent(params);
        console.log("In the fetch function.");
        return function () {
            // console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            // console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    }
                    else {
                        throw response;
                    }
                }).catch((e) => { console.log(e); });
        };
    },

    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getContentByPropValue: function (params) {
        var fetchArgs = exports.ContentMetadataApiFetchParamCreactor.getContentByPropValue(params);
        return function () {
            console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response);
                        return response.json();
                    }
                    else {
                        console.log(response);
                        throw response;
                    }
                }).catch((e) => { console.log(e); });
        };
    },
};
/**
 * ContentMetadataApi - object-oriented interface
 */
var ContentMetadataApi = (function (_super) {
    __extends(ContentMetadataApi, _super);
    function ContentMetadataApi() {
        _super.apply(this, arguments);
    }

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    ContentMetadataApi.prototype.getAllContent = function (params) {
        return exports.ContentMetadataApiFp.getAllContent(params)(this.fetch, this.basePath);
    };

    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    ContentMetadataApi.prototype.getContentByPropValue = function (params) {
        return exports.ContentMetadataApiFp.getContentByPropValue(params)(this.fetch, this.basePath);
    };
    return ContentMetadataApi;
}(BaseAPI));
exports.ContentMetadataApi = ContentMetadataApi;
;
/**
 * ContentMetadataApi - factory interface
 */
exports.ContentMetadataApiFactory = function (fetch, basePath) {
    return {

        /**
         * get all content_metadata objects from the Activity Index
         * @param limit The maximum number of objects that will be returned
         * @param offset Determines the first object to be returned
         */
        getAllContent: function (params) {
            return exports.ContentMetadataApiFp.getAllContent(params)(fetch, basePath);
        },

        /**
         * Find Content by property:value
         * Returns Content matching this content
         * @param property property to search on
         * @param value value to search on
         */
        getContentByPropValue: function (params) {
            return exports.ContentMetadataApiFp.getContentByPropValue(params)(fetch, basePath);
        },
    };
};
/**
 * ContentSetApi - fetch parameter creator
 */
exports.ContentSetApiFetchParamCreactor = {

    /**
     * Find Contentset by property:value
     * Returns Contentset matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getContentSetByPropValue: function (params) {
        // verify required parameter "property" is set
        if (params["property"] == null) {
            throw new Error("Missing required parameter property when calling getContentSetByPropValue");
        }
        // verify required parameter "value" is set
        if (params["value"] == null) {
            throw new Error("Missing required parameter value when calling getContentSetByPropValue");
        }
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getContentSetByPropValue");
        }
        var baseUrl = "/contentset/{property}/{value}"
            .replace("{" + "property" + "}", "" + params.property)
            .replace("{" + "value" + "}", "" + params.value);
        var urlObj = url.parse(baseUrl, true);
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },

    /**
     * return a list of content sets
     * Returns list of Content_Sets
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getContentSets: function (params) {
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getContentSet");
        }

        var baseUrl = "/contentset";
        var urlObj = url.parse(baseUrl, true);

        urlObj.query = assign({}, urlObj.query, {
            "limit": params.limit,
            "offset": params.offset,
        });
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },
};
/**
 * ContentSetApi - functional programming interface
 */
exports.ContentSetApiFp = {

    /**
     * Find Contentset by property:value
     * Returns Contentset matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getContentSetByPropValue: function (params) {
        var fetchArgs = exports.ContentSetApiFetchParamCreactor.getContentSetByPropValue(params);
        return function () {
            console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response);
                        return response.json();
                    }
                    else {
                        console.log(response);
                        throw response;
                    }
                }).catch((e) => { console.log(e); });
        };
    },

    /**
     * return a list of content sets
     * Returns list of Content_Sets
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getContentSets: function (params) {
        var fetchArgs = exports.ContentSetApiFetchParamCreactor.getContentSets(params);
        return function () {
            console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    }
                    else {
                        throw response;
                    }
                }).catch((e) => { console.log(e); });
        };
    },
};
/**
 * ContentSetApi - object-oriented interface
 */
var ContentSetApi = (function (_super) {
    __extends(ContentSetApi, _super);
    function ContentSetApi() {
        _super.apply(this, arguments);
    }

    /**
     * Find Contentset by property:value
     * Returns Contentset matching this content
     * @param property property to search on
     * @param value value to search on
     */
    ContentSetApi.prototype.getContentSetByPropValue = function (params) {
        return exports.ContentSetApiFp.getContentSetByPropValue(params)(this.fetch, this.basePath);
    };

    /**
     * return a list of content sets
     * Returns list of Content_Sets
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    ContentSetApi.prototype.getContentSets = function (params) {
        return exports.ContentSetApiFp.getContentSets(params)(this.fetch, this.basePath);
    };
    return ContentSetApi;
}(BaseAPI));
exports.ContentSetApi = ContentSetApi;
;
/**
 * ContentSetApi - factory interface
 */
exports.ContentSetApiFactory = function (fetch, basePath) {
    return {

        /**
         * Find Contentset by property:value
         * Returns Contentset matching this content
         * @param property property to search on
         * @param value value to search on
         */
        getContentSetByPropValue: function (params) {
            return exports.ContentSetApiFp.getContentSetByPropValue(params)(fetch, basePath);
        },

        /**
         * return a list of content sets
         * Returns list of Content_Sets
         * @param limit The maximum number of objects that will be returned
         * @param offset Determines the first object to be returned
         */
        getContentSets: function (params) {
            return exports.ContentSetApiFp.getContentSets(params)(fetch, basePath);
        },
    };
};
/**
 * LearningExperienceApi - fetch parameter creator
 */
exports.LearningExperienceApiFetchParamCreactor = {

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getAllLearningExperience: function (params) {
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getLearningExperience");
        }

        var baseUrl = "/learningexperience";

        if (params["competency"]) {
            baseUrl = `/learningexperience?competency=${encodeURIComponent(params.competency)}`;
        }

        var urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "limit": params.limit,
            "offset": params.offset,
        });
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },
    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getLearningExperienceByPropValue: function (params) {
        // verify required parameter "property" is set
        if (params["property"] == null) {
            throw new Error("Missing required parameter property when calling getLearningExperienceByPropValue");
        }
        // verify required parameter "value" is set
        if (params["value"] == null) {
            throw new Error("Missing required parameter value when calling getLearningExperienceByPropValue");
        }
        if (params["URL"] == null) {
            throw new Error("Missing required parameter URL when calling getLearningExperienceByPropValue");
        }
        var baseUrl = "/learningexperience/{property}/{value}"
            .replace("{" + "property" + "}", "" + params.property)
            .replace("{" + "value" + "}", "" + params.value);
        var urlObj = url.parse(baseUrl, true);
        var fetchOptions = {
            method: "GET",
            protocol: "http://"
        };
        var contentTypeHeader;
        if (contentTypeHeader) {
            fetchOptions.headers = contentTypeHeader;
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
            basePath: params.URL
        };
    },
};
/**
 * LearningExperienceApi - functional programming interface
 */
exports.LearningExperienceApiFp = {

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    getAllLearningExperience: function (params) {
        console.log("Starting fetch.")
        var fetchArgs = exports.LearningExperienceApiFetchParamCreactor.getAllLearningExperience(params);
        // console.log(fetchArgs);
        return function () {
            console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();;
                    }
                    else {
                        throw response;
                    }
                }).catch((e) => { console.log(e); });
        };
    },
    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    getLearningExperienceByPropValue: function (params) {
        var fetchArgs = exports.LearningExperienceApiFetchParamCreactor.getLearningExperienceByPropValue(params);
        return function () {
            console.log(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url);
            return fetch(fetchArgs.options.protocol + fetchArgs.basePath + fetchArgs.url, fetchArgs.options)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response);
                        return response.json();
                    }
                    else {
                        throw response;
                    }

                }).catch((e) => { console.log(e); });
        };
    },
};
/**
 * LearningExperienceApi - object-oriented interface
 */
var LearningExperienceApi = (function (_super) {
    __extends(LearningExperienceApi, _super);
    function LearningExperienceApi() {
        _super.apply(this, arguments);
    }

    /**
     * get all content_metadata objects from the Activity Index
     * @param limit The maximum number of objects that will be returned
     * @param offset Determines the first object to be returned
     */
    LearningExperienceApi.prototype.getAllLearningExperience = function (params) {
        return exports.LearningExperienceApiFp.getAllLearningExperience(params)(this.fetch, this.basePath);
    };
    /**
     * Find Content by property:value
     * Returns Content matching this content
     * @param property property to search on
     * @param value value to search on
     */
    LearningExperienceApi.prototype.getLearningExperienceByPropValue = function (params) {
        return exports.LearningExperienceApiFp.getLearningExperienceByPropValue(params)(this.fetch, this.basePath);
    };
    return LearningExperienceApi;
}(BaseAPI));
exports.LearningExperienceApi = LearningExperienceApi;
;
/**
 * LearningExperienceApi - factory interface
 */
exports.LearningExperienceApiFactory = function (fetch, basePath) {
    return {

        /**
         * get all content_metadata objects from the Activity Index
         * @param limit The maximum number of objects that will be returned
         * @param offset Determines the first object to be returned
         */
        getAllLearningExperience: function (params) {
            return exports.LearningExperienceApiFp.getAllLearningExperience(params)(fetch, basePath);
        },
        /**
         * Find Content by property:value
         * Returns Content matching this content
         * @param property property to search on
         * @param value value to search on
         */
        getLearningExperienceByPropValue: function (params) {
            return exports.LearningExperienceApiFp.getLearningExperienceByPropValue(params)(fetch, basePath);
        },
    };
};