// Entry point for the LRS re-route service.
//
// This is a NodeJS Express application.
//
const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const btoa = require("btoa");
const axios = require("axios").default;
const keycloakAdapter = require("simple-keycloak-adapter");

const config = require("./config");
const fedApi = require("./lib/fedApi");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

const currentViews = {};
const targetStudents = {};

// Handler to allow for secret key instead of Keycloak auth.
function auth(req, res, next) {
    if (req.query.secret == config.secret)
        next();
    else
        keycloakAdapter.protect()(req, res, next);
}

// Handler to confirm our request looks correct.
function validate(req, res, next) {
    let payload = (req.method == "GET") ? req.query : req.body;

    console.log("Payload:", payload)

    // Check the user is allowed to be doing this (needs secret or admin rights).
    if (payload.secret != config.secret && res.locals.user.admin == false && res.locals.user.id != payload.user)
        res.status(401).send(`Unauthorized: Admin or Secret access required to modify other users.`)
    else
        next();
}

/**
 * Lastly, configure that Express instance to serve this page.
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));
app.use("*", function (req, res, next) {
    if (req.baseUrl.startsWith(config.root) == false)
        res.redirect(config.root + req.url);
    else
        next();
});

app.use("*", (req, res, next) => {

    res.locals.lrs = config.lrs;
    next();
});

// Set up our Keycloak adapter.
app.use(keycloakAdapter.init(config.keycloak, config.root + "/logout"));

app.use("*", keycloakAdapter.protect(), async function (req, res, next) {

    // First, get all Person data from the LP.
    let personEndpoint = config.lp + "/person";
    let personRes = await axios.get(personEndpoint + `?secret=${config.secret}`);
    let persons = await personRes.data;

    // Next, get data for this user.
    let userData = persons.find(x => x.uuid === res.locals.user.id);
    console.log("User data:", userData);

    // This gives us our UX roles, which we need for further logic.
    res.locals.roles = trimUserRoles(userData.uxRoles);

    // Now use Keycloak data and any redirect info to get data for the current actor.
    let authEpt = config.authHelper;
    let authRes = await axios.get(authEpt + `?secret=${config.secret}`);
    let tlaUsers = authRes.data;

    let actorID = (targetStudents[res.locals.user.id]) ? targetStudents[res.locals.user.id] : res.locals.user.id;
    let actorData = tlaUsers.find(t => t.id === actorID);

    res.locals.actor = {
        id: actorID,
        name: actorData.username
    };
    res.locals.view = currentViews[res.locals.user.id];

    // Get the actors's completed tasks and relevant events.
    res.locals.completed = await getCompletedTasks(res.locals.actor.id);
    res.locals.events = await getEventList(res.locals.actor.id);

    // We don't care about the rest of this unless we're an OICS or Admin.
    if (res.locals.roles.includes("Admin") || res.locals.roles.includes("OICS"))
    {
        let intGrpEndpoint = config.lp + "/interestGroup";
        let intGrpRes = await axios.get(intGrpEndpoint + `?secret=${config.secret}`);
        let intGrp = intGrpRes.data;

        let intGrpMemberEndpoint = config.lp + "/interestGroupMembers";
        let intGrpMemberRes = await axios.get(intGrpMemberEndpoint + `?secret=${config.secret}`);
        let intGrpMembers = intGrpMemberRes.data;

        res.locals.group = "";
        res.locals.students = [];

        // Get all students in our primary interest group, if we have one.
        if (Array.isArray(intGrp) && intGrp.length && Array.isArray(intGrpMembers) && intGrpMembers.length)
        {
            let userIntGrps = intGrpMembers.filter(x => x.memberId === userData.id); // Get all our interest groups.
            let targetIntGrp = userIntGrps.find(x => x !== undefined); // Get the first entry in the list.
            let intGrpData = intGrp.find(x => x.id === targetIntGrp.groupId); // Get the data for that entry.

            res.locals.group = intGrpData.id;

            // Next, get all the target group's members.
            let targetGrpMembers = intGrpMembers.filter(x => x.groupId === targetIntGrp.groupId);

            // Again, we only care about their IDs.
            let targetGrpMemIDs = [];
            targetGrpMembers.forEach(x => targetGrpMemIDs.push(x.memberId));

            // Now get the Learners from the member list.
            persons.forEach(function(p) {
                if (p.id !== userData.id && targetGrpMemIDs.includes(p.id) && p.uxRoles.includes('Learner'))
                {
                    let target = tlaUsers.find(t => t.id === p.uuid);
                    let student = { id: p.uuid, name: target.username };
                    res.locals.students.push(student);
                }
            });
        }
    }

    next();
});

// Page for viewing main page.
/* app.get(config.root, keycloakAdapter.protect(), async function (req, res) {

    let workspaceType = "iframe";
    let workspaceFrame = req.query.frame;

    if (workspaceFrame === undefined)
    {
        workspaceType = "landing";
        workspaceFrame = "";
    }

    res.render("main.ejs", {
        root: config.root,
        secret: config.secret,
        type: workspaceType,
        frame: workspaceFrame,
        arrm: config.arrm,
        dave: config.dave,
        vlrc: config.vlrc,
        relatedExperiences: []
    });
}); */

app.get(config.root + "/student/:student", async function (req, res) {

    targetStudents[res.locals.user.id] = req.params.student;
    res.redirect(config.root);
});

app.get(config.root + "/view/:view", async function (req, res) {

    currentViews[res.locals.user.id] = req.params.view;
    targetStudents[res.locals.user.id] = res.locals.user.id;
    res.redirect(config.root);
});

//Changed route to change landing to experiences
app.get(config.root/*  + '/experiences' */, keycloakAdapter.protect(), async function (req, res) {

    console.log("Hit experience page.");
    let titles = Object.keys(config.LearningExperience.Titles);
    let limit = 0, offset = 0;

    let results;

    let competency = req.query.competency;

    if (competency === undefined) {
        console.log("\nCompetency should be undefined.\n");
        console.log(competency);
        results = await fedApi.LearningExperienceApiFp
            .getAllLearningExperience({ limit: limit, offset: offset, URL: config.LearningExperience.URL }).call();

    } else {
        console.log("\nCompetency should be real.\n");
        console.log(competency);
        results = await fedApi.LearningExperienceApiFp
            .getAllLearningExperience({ limit: limit, offset: offset, URL: config.LearningExperience.URL, competency: competency }).call();
    }
    console.log('\n\nresults\n\n');
    console.log(results);

    let comps = await fedApi.Competency.getComps();

    let tableExp = [];
    if (results.rows)
        tableExp = generateTable(results, titles);
    
    res.render('main.ejs', {
        root: config.root,
        secret: config.secret,
        type: "experience",
        page: 'Learning Experiences',
        menuId: 'Experiences',
        titles: titles,
        tabledata: tableExp,
        comps: comps,
        arrm: config.arrm,
        dave: config.dave,
        vlrc: config.vlrc,
        frame: "experiences",
        competency: ( competency ) ? competency : "",
    });
});

// Then start the server.
server.listen(APP_PORT, "0.0.0.0", function () {
    console.log("[HTTP] Keycloak Helper service started on port %s", APP_PORT);
});

// Helper function to format the data for the generated EJS table.
function generateTable(results, titles) {

    var row = 0,
    rowlimit = results.rows.length;

    let table = [];

    while (row < rowlimit) {

        let temprow = {};
        col = 0;

        titles.forEach((title) => {
            temprow[title] = results.rows[row][title];
        });

        row++;
        table.push(temprow);
    }

    return table;
};

function trimUserRoles(roles) {
    
    let trim = [];

    if (roles.includes("Administrator"))
        trim.push("Admin");
    if (roles.includes("Observer") || roles.includes("Instructor") || roles.includes("Controller") || roles.includes("Supervisor"))
        trim.push("OICS");
    if (roles.includes("Learner"))
        trim.push("Student");
        
    return trim;
}

async function getCompletedTasks(actor) {

    let response = await axios.get(config.scheduler + `?user=${actor}&secret=${config.secret}`);
    let tasks = response.data;

    let ret = [];
    tasks.forEach(function(x) {
        if (x.status === "completed")
            ret.push(x.uri);
    });

    return ret;
}

async function getEventList(actor) {
    
    let agentObj = {
        "account": {
            "name": actor,
            "homePage": "https://auth.somewhere.net"
        }
    };
    let agent = JSON.stringify(agentObj);

    let query = `agent=${encodeURIComponent(agent)}&limit=20`;
    let endpoint = config.lrs.endpoint + "statements?" + query;
    let response = await axios.get(endpoint, {
        headers: {
            "Authorization": "Basic " + btoa(`${config.lrs.user}:${config.lrs.pass}`),
            "Content-Type": "application/json",
            "X-Experience-API-Version": "1.0.3"
        }
    });
    let statements = response.data.statements;

    let verbFilter = ["abandoned", "captured", "completed", "deselected", "initialized", "planned", "scheduled"];
    let events = statements.filter(x => verbFilter.includes(x.verb.display["en-US"]));

    return events;
}