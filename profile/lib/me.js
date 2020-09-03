const axios = require("axios").default
const config = require("../config");

module.exports = async(uuid) => {

    let me = {}

    let responses = await Promise.all([
        axios.get(`https://kafka.somewhere.net/goals/api/read?user=${uuid}&secret=${config.secret}`)
            .then(res => {
                me.goals = res.data
            })
            .catch(err => {
                me.goals = []
            }),

        axios.get(`https://kafka.somewhere.net/competencies/api/read?user=${uuid}&secret=${config.secret}`)
            .then(res => {
                me.competencies = res.data
            })
            .catch(err => {
                me.competencies = []
            }),

        axios.get(`https://kafka.somewhere.net/scheduler/tasks?user=${uuid}&secret=${config.secret}`)
            .then(res => {
                me.tasks = res.data
            })
            .catch(err => {
                me.tasks = []
            })
        ])

    return me;
}