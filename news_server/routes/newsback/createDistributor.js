var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
  extended: true
}));

/* GET users listing. */
router.post('/', function(req, res, next) {

    let item = req.body;
    let arr = [item.did, JSON.stringify(item.channelList),JSON.stringify(item.adList),item.newsApiUpstream,item.detailRecommendApiUpstream,item.adLayerStatus,item.detailRecommendNewsCount,item.feedStatus,item.adDownLayerStatus,item.speechcraftStatus,item.speechcraftContent,item.speechcraftChance,item.newsShowCount];    
    let strSql = `insert into distributor (did,channelList,adList,newsApiUpstream,detailRecommendApiUpstream,adLayerStatus,detailRecommendNewsCount,feedStatus,adDownLayerStatus,speechcraftStatus,speechcraftContent,speechcraftChance,newsShowCount) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.query(strSql, arr, (err, result) => {
        if (err) {
            console.log(err);
            res.render('success', {code: 0, data: "请求错误", message: err });
        } else {
            res.render('success', {code: 1, data: "创建成功", message: 'success' });
            console.log(result);
        }
    });
});

module.exports = router;
