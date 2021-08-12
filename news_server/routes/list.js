var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const { page, count } = req.body;
    var num = (page-1)*count;
    // let param = "SELECT * FROM lists where id>0 limit='${num}', '${count}'";
    let param = "SELECT * FROM lists";
    db.query(param, (err, sqlResult) => {
        if (err) {
            console.error('list访问失败;', err.message);
            res.render('fail', { message: err.message })
            return;
        }
      res.render('success', {code: 1, data: JSON.stringify(sqlResult), message: 'success' })
    });
});

module.exports = router;
