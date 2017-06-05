var express = require('express');
var axios = require('axios');
var router = express.Router();


router.post('/', function(req, res) {
  var token = req.body.token;
  var username = req.body.username;

  createFilelist(req, res, token, username);
})


function createFilelist(req, res, token, username) {
  axios.post('https://slack.com/api/users.list?token=' + token)
  .then(function (result) {

    if (!result.data.ok) {
      res.json({
        error: 'not_authed'
      });
      return;
    }

    var members = result.data.members;
    for (key in members) {
      if (members[key].name === username) {
        var userid = members[key].id;

        getFilelist(req, res, token, userid);
        break;
      }
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}


function getFilelist(req, res, token, userid) {
  axios.post('https://slack.com/api/files.list?token=' + token + '&user=' + userid)
  .then(function (result) {
    res.json({
      files: result.data.files
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}


module.exports = router;
