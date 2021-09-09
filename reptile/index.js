let request = require('request');
// let iconv = require('iconv-lite');
let mysql = require('mysql');
let axios = require('axios');
let cheerio = require('cheerio');
let http = require('http');
let fs = require('fs');

let options = {
  host:'123.56.63.104',
  port:'3306',//可选，默认是3306
  user:'root', //数据库名
  password:'', //数据库密码
  database:'newsmysql' //选择连接指定的数据库
}
// 创建与数据库的连接的对象，传递参数
let con =  mysql.createConnection(options);
// 建立连接
con.connect((err) => {
  // 如果建立连接失败
  if (err) {
    console.log(err);
  }else {
    console.log('数据库连接成功');
  }
});


/**爬取行为列表 */
async function getPageUrl(url, callback) {
   let httpUrl = url;
   let res = await axios.get(httpUrl)
    callback(res.data);
}

let getImgUrl = function(url, name) {
    request(url).pipe(
        fs.createWriteStream(`../news_web/static/upLoadImg/${name}`).on('close',err=>{  console.log('写入失败',err) })
    );
}

var channelId = "1202881627189526528";
let reptileChannelList = function () {
    let url = `https://n.opgirl.cn/api/news/findNewsList?did=1187289889406447616&channelId=${channelId}&page=2&count=15`;
    getPageUrl(url, function (data) {
        if(data.code === 1) {
            let item = data.data;
            item.forEach((a, b) => {
                let imgList = a.imgList;
                let list = [];
                imgList.forEach((imgItem) => {
                    let name = `/${imgItem.split("/")[11]}`;
                    getImgUrl(imgItem, name);
                    list.push(name);
                })
                a.imgList = list;

            });
            for(let i = 0; i < item.length; i++) {
                // console.log(item[i]);  
                let arr = [item[i].id, item[i].title, item[i].author, `${item[i].imgList}`, item[i].createTime, item[i].imgCount, item[i].siteType, channelId];    
                let strSql = `insert into lists (id,title,author,imgList,createTime,imgCount,siteType,channelId) values (?,?,?,?,?,?,?,?)`;
                con.query(strSql, arr, (err, result) => {
                    if (err) {
                    console.log(err);
                    } else {
                    console.log(result);
                    }
                })
            }
            // console.log(item, '=======');
        }
   });
};
// reptileChannelList();

let reptileDetail = function() {
    let url = `http://localhost:3000/api/list?did=2&channelId=${channelId}&page=1&count=100`;
    getPageUrl(url, (res) => {
        let data = res.data;
        console.log("list请求成功！！",data);
        data.forEach((item) => {
            let url = `https://n.opgirl.cn/api/news/getNewsById?did=1187289889406447616&newsId=${item.id}&channelId=${channelId}`;
            getPageUrl(url, (res) => {
                console.log("detail请求成功！！！")
                let data = res.data,
                    time = data.createTime.split("-"),
                    replaceUrl = new RegExp(`https://gallery.opgirl.cn/news/${data.siteId}/${time[0]}/${time[1]}/${time[2].split(" ")[0]}/${data.id}`,"g");
                let resContent = data.content.replace(replaceUrl, "");
                    data.content = resContent;
                let imgList = data.imgList;
                imgList.forEach((imgItem) => {
                    let name = `/${imgItem.split("/")[11]}`;
                    getImgUrl(imgItem, name);
                })
                let arr = [data.id, data.title, data.author, data.channelId, data.createTime, data.nextId, data.lastId || "", data.content, data.siteId, data.siteType];    
                let strSql = `insert into detail (id,title,author,channelId,createTime,nextId,lastId,content,siteId, siteType) values (?,?,?,?,?,?,?,?,?,?)`;
                con.query(strSql, arr, (err, result) => {
                    if (err) {
                    console.log(err);
                    } else {
                    console.log(result);
                    }
                })
            });
        })
        // console.log(data);
    })

}
// reptileDetail();

