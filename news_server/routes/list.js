var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //模糊查询的sql  SELECT * FROM  bloginformation WHERE blogTitle LIKE ? OR blogContent LIKE ? OR blogLable LIKE ?
    var params = req.query || req.params;
    let sql = "SELECT * FROM `lists`";   //查询列表所有的数据
    let content = [];
    let isMore = false;//是否有多个查询参数
    if(params.channelId){
        // 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
        // sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
        sql += " WHERE channelId LIKE ?";
        content.push( "%"+params.channelId+"%" );
        isMore = true;
    }
    // if(params.age){
    //     if(isMore){//true代表有多个参数
    //         sql += "and age like ?";//and是两个条件都必须满足，or是或的关系
    //     }else{
    //         sql += " WHERE age LIKE ?";
    //     }
    //     content.push( "%"+params.age+"%" );
    // }

    /** sql 按列表降序排列 desc/asc */
    sql += "ORDER BY createTime DESC";
    /** end */

    if(params.page || params.count){//开启分页
        let current = params.page;//当前页码
        let pageSize = params.count;//一页展示多少条数据
        sql += " limit ?,?";
        content.push((current-1)*pageSize,parseInt(pageSize));
    }

    db.query(sql, content, (err, sqlResult) => {
        if (err) {
            console.error('list访问失败;', err.message);
            res.render('fail', { message: err.message })
            return;
        }
        /**imgList 处理为数组格式， mysql为str格式 start */
        sqlResult.forEach((item) => {
            let list = item.imgList.split(",");
            if(list.length > 0) item.imgList = list;
            else item.imgList = [];
        });
        /** end */

        res.render('success', {code: 1, data: JSON.stringify(sqlResult), message: 'success' })
    });

});

module.exports = router;
