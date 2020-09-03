// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
//const WebSocket = require('ws');
const express = require("express");
//const kafkaConsumer = require("simple-kafka-consumer");
const keycloakHelper = require("simple-keycloak-adapter");

const config = require("./config");

const APP_PORT = (process.env.APP_PORT || 3000);
//const WS_PORT = (process.env.WS_PORT || 8000);
const WS_PASSWORD = (process.env.WS_PASSWORD || "some-password");

const app = express();
const server = http.createServer(app);

const axios = require("axios").default;

const bodyParser = require('body-parser');

//body parser for form input
app.use(bodyParser.json());

/**
 * Lastly, configure that express instance to serve this page.
 */
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("scripts"));
app.use(express.static("views"));
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));



//intercept all req for the Experience Index 

//Still need to add Auth to the middlewear
app.use("*", async function (req, res, next) {
    console.log(req);
    //console.log(req.body);

    /* //Send Cureated if creating or updating a list that isn't a course
    if ((req.method == "POST" || req.method == "PUT") && req.body[0] && (req.body[0]['IsCourse'] == false || req.body[0]['IsCourse'] == '0' )) {
        //Send Cureated verb
        console.log("\n\nPOST or PUT method");
        console.log("body = " + req.body);
        console.log(config.proxyURL + req.baseUrl.replace( '/experience' ,''));
        let newPostPut =  await axios.post(config.proxyURL + '/contentset' , req.body ).then((res) =>{ return res;});
        console.log(newPostPut);
        if(newPostPut.status == 200){

            //Send Currated verb here

            res.status(200).json( newPostPut.data );
        }else {
            res.status(newPostPut.status).status("The server couldn't complete your POST/PUT. Sorry.");
        }
    } */

    //forward POST for Activity, Content, Experiences, ContentSet(courses)
    if(req.method == "POST"){
        console.log("hit the POST clause");
        let newPost = await axios.post(config.proxyURL + req.baseUrl.replace( '/experience' ,'') , req.body ).then((res) =>{ return res;});
        console.log(newPost);

        if(newPost.status == 200){
            
            if(req.baseUrl.includes(config.ContentSetURI))
            //send Curated verb here on the successful POST 

            res.status(200).send( newPost.data );
        }else {
            res.status(newPost.status).status("The server couldn't complete your POST. Sorry.");
        }
    }

    else if(req.method == "PUT"){
        console.log("hit the PUT clause");
        let newPut = await axios.put(config.proxyURL + req.baseUrl.replace( '/experience' ,'') , req.body).then((res) =>{ return res;});
        console.log(newPut);

        if(newPut.status == 200){

            if(req.baseUrl.includes(config.ContentSetURI))
                console.log("is a content list");
            //send Curated verb here on the successful PUT 

            res.status(200).send( newPut.data );
        }else {
            res.status(newPut.status).status("The server couldn't complete your PUT. Sorry.");
        }
    }

    else if(req.method == "DELETE"){
        console.log("hit the delete clause");
        let newDelete = await axios.delete(config.proxyURL + req.baseUrl.replace( '/experience' ,'')).then((res) =>{ return res;});
        console.log(newDelete);
        if(newDelete.status == 200){
            res.status(200).send( newDelete.data );
        }else {
            res.status(newDelete.status).status("The server couldn't complete your delete. Sorry.");
        }
    }

    //forward along all other valid req on to the Experience Index
    else {
        //remove the the root url of this proxy but perserve the request variable then append to EI url
        res.status(400).send("Sorry this isn't a supported action.");
    }

});

// Setup our keycloak adapter
app.use(keycloakHelper.init(config.keycloak));
app.listen(3000);
