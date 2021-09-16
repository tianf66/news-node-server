var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //模糊查询的sql  SELECT * FROM  bloginformation WHERE blogTitle LIKE ? OR blogContent LIKE ? OR blogLable LIKE ?
    var params = req.query || req.params;
    let sql = "SELECT * FROM `distributor`";   //查询列表所有的数据
    let content = [];
    let isMore = false;//是否有多个查询参数
    if(params.did){
        // 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
        // sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
        sql += " WHERE did LIKE ?";
        content.push( "%"+params.did+"%" );
        isMore = true;
    }

    db.query(sql, content, (err, sqlResult) => {
        if (err) {
            console.error('访问失败;', err.message);
            res.render('fail', { message: err.message })
            return;
        }
        
        let item = sqlResult[0];
        if(item) {
            item.channelList = JSON.parse(item.channelList);
            item.adList = JSON.parse(item.adList);
            res.render('success', {code: 1, data: JSON.stringify(item), message: 'success' });
        } else {
            res.render('success', {code: 0, data: "", message: 'no distributor' });
        }
        
    });

});

module.exports = router;
