var express = require('express');
var axios = require('axios');
var router = express.Router();


router.post('/', function(req, res) {
  var token = req.body.token;
  var target = req.body.target;

  if (target === undefined) {
    res.json({
      error: 'empty'
    });
    return;
  }

  if (Object.prototype.toString.call(target) !== '[object Array]') {
    var _target = [];
    _target.push(target);

    if (target !== undefined) {
      destroyFiles(req, res, token, _target);
    }
  } else {
    if (target !== undefined) {
      destroyFiles(req, res, token, target);
    }
  }
})


function destroyFiles(req, res, token, target) {

  for (var i = 0; i < target.length; i++) {
    axios.post('https://slack.com/api/files.delete?token=' + token + '&file=' + target[i])
    .then(function (result) {
      res.json({
        ok: result.data.ok
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}


module.exports = router;
