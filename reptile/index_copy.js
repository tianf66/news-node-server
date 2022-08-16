process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let request = require('request');
// let iconv = require('iconv-lite');
let mysql = require('mysql');
let axios = require('axios');
let cheerio = require('cheerio');
let http = require('http');
let fs = require('fs');

// http.request(path,{

//     rejectUnauthorized:false

//   })

// let options = {
//   host:'123.56.63.104',
//   port:'3306',//可选，默认是3306
//   user:'root', //数据库名
//   password:'', //数据库密码
//   database:'newsmysql' //选择连接指定的数据库
// }
// // 创建与数据库的连接的对象，传递参数
// let con =  mysql.createConnection(options);
// // 建立连接
// con.connect((err) => {
//   // 如果建立连接失败
//   if (err) {
//     console.log(err);
//   }else {
//     console.log('数据库连接成功');
//   }
// });


/**爬取行为列表 */
async function getPageUrl(url, callback) {
   let res = await axios.get(url, {strictSSL: false}).catch(function (error) { 
        console.error('Error!!!! ' + error.message) 
      });
    callback(res.data);
}

let getImgUrl = function(url, name) {
    // request(url).pipe(
    // let = fileStrame = fs.createWriteStream(`../news_web/static/images/${name}`).on('close',err=>{  console.log('写入失败',err) })
    let = fileStrame = fs.createWriteStream(`../news_web/static/images/${name}`, {autoClose: true});
    request(url, {
        rejectUnauthorized:false
      }).pipe(fileStrame);
    fileStrame.on('finish', function() {
        console.log('success');
    });
}

let reptileChannelList = function () {
    let url = `http://localhost:8080/static/data/list.json`;
    getPageUrl(url, function (data) {
        if(data.code === 1) {
            let item = data.data;
            item.forEach((a, b) => {
                let imgList = a.imgList;
                let list = [];
                imgList.forEach((imgItem) => {
                    getImgUrl(imgItem, `${imgItem.split("/")[11]}`)
                })

            });
        }
   });
};
// reptileChannelList();

let reptileDetail = function() {
    
    let list = [];
    let url = `http://localhost:8080/static/data/list.json`;
    getPageUrl(url, (res) => {
        let data = res.data;
        // console.log("list请求成功！！",data);
        data.forEach((item) => {
            let url = `https://n.opgirl.cn/api/news/getNewsById?did=1139493582617448448&newsId=${item.id}&channelId=1142047545493557248`;
            getPageUrl(url, (res) => {
                let data = res.data;

                // console.log(data, "detail请求成功！！！")
                //     time = data.createTime.split("-"),
                //     replaceUrl = new RegExp(`https://gallery.opgirl.cn/news/${data.siteId}/${time[0]}/${time[1]}/${time[2].split(" ")[0]}/${data.id}`,"g");
                // let resContent = data.content.replace(replaceUrl, "/static/images");
                //     data.content = resContent;
                // let imgList = data.imgList;
                // imgList.forEach((imgItem) => {
                //     let name = `/${imgItem.split("/")[11]}`;
                //     getImgUrl(imgItem, name);
                // });
                let obj = {};
                obj.id = data.id;
                obj.title = data.title;
                obj.content = data.content;
                obj.author = data.author;
                obj.createTime = data.createTime;
                obj.siteType = data.siteType;
                obj.lastId = data.lastId;
                obj.nextId = data.nextId;
                obj.channelId = data.channelId;
                obj.siteId = data.siteId;
                list.push(obj);
            });
        })


        setTimeout(() => {
            // fs.writeFile('./detail1.json', list, (err) => {
            //     if (err) {
            //         throw err;
            //     }
            //     console.log("JSON data is saved.");
            // });
            console.log('===', list, '===');
        }, 10000);
    })

}
reptileDetail();

// getPageUrl('https://n.opgirl.cn/api/news/getNewsById?did=1139493582617448448&newsId=868375e5-304f-4afd-af3c-c2de3d8f8725&channelId=1309314115054419968', (res) => {
//             console.log("detail请求成功！！！")
//             // let data = res.data;
//                 // time = data.createTime.split("-"),5aafd78f-05b2-473f-804e-7af304414470
//                 // replaceUrl = new RegExp(`https://gallery.opgirl.cn/news/${data.siteId}/${time[0]}/${time[1]}/${time[2].split(" ")[0]}/${data.id}`,"g");
//             // let resContent = data.content.replace(replaceUrl, "");
//                 // data.content = resContent;
//             // let imgList = data.imgList;
//             // imgList.forEach((imgItem) => {
//                 // let name = `/${imgItem.split("/")[11]}`;
//                 // getImgUrl(imgItem, name);
//             // });
//             // console.log(data);
//             console.log(res);
//         });
