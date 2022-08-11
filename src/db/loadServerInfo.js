const sis_model = require('./schemas/serverInfoSchema');

var server_info = [];

sis_model.find({}, (err, res) => {
    if(err) return console.log(err);
    server_info.push(res[0]);
});

module.exports = server_info;