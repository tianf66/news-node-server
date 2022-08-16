import dataCenter from '@/store/index.js';
import utils from '@/utils/index.js';

/*
    详情页api请求 start
*/
const getDetailItem = function({commit, dispatch, state}, params) {
	return new Promise((resolve, reject) => {
        dataCenter.getDetail(params).then((data) => {
        	commit({
        		type: 'SETDETAIL',
        		detail: data
        	});
            document.title = data.title || '最新资讯';
 			resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};
/*
    详情页api请求 end
*/


/*
    详情页feed流广告封装 start
*/
let listCount = 0, adIntervalIndex = 0;

function getDetailFeedAdIntervalSlotId() {
    let ads = window.config.adList;
    let detailFeedAdId = ads && ads.detailFeed && ads.detailFeed.id ? ads.detailFeed.id.split(',') : null;
    if(detailFeedAdId && detailFeedAdId[adIntervalIndex]) {
        return {id: detailFeedAdId[adIntervalIndex]};
    }
}

function getDetailFeedAdIntervalSlodInterval() {
    let ads = window.config.adList;
    let detailFeedAdId = ads && ads.detailFeed && ads.detailFeed.id ? ads.detailFeed.id.split(',') : null;
    let detailFeedAdInterval = detailFeedAdId && ads.detailFeed.interval ? ads.detailFeed.interval.split(',') : null;
    if(detailFeedAdInterval && detailFeedAdInterval[adIntervalIndex]) {
        return parseInt(detailFeedAdInterval[adIntervalIndex]);
    }
}

function getDetailFeedAdIntervalSlodClick() {
    let ads = window.config.adList;
    let detailFeedAdId = ads && ads.detailFeed && ads.detailFeed.id ? ads.detailFeed.id.split(',') : null;
    let detailFeedAdClick = detailFeedAdId && ads.detailFeed.adClickTime ? ads.detailFeed.adClickTime.split(',') : null;
    if(detailFeedAdClick && detailFeedAdClick[adIntervalIndex]) {
        return detailFeedAdClick[adIntervalIndex];
    }
}

/*
    详情页feed流广告封装 end
*/


/*
    详情页推荐api, 广告封装相关 start
*/
function getColumnsData(data, page) {
    if(page == 1) {
        listCount = 0;
    }
    let columns = [];

    for(let i = 0; i < data.length; i++) {
        listCount++;
        let list = data[i];

        let interval = getDetailFeedAdIntervalSlodInterval(), slotId = getDetailFeedAdIntervalSlotId(), slotClickCount = getDetailFeedAdIntervalSlodClick();
        if(slotId && !slotId.id) {
             adIntervalIndex = 0;
        }
        if(interval === 0 || listCount % interval === 0) {
            listCount = 0;
            adIntervalIndex++;
            if(interval === 0) {
                columns.push({
                    id: `ad_${utils.getUid()}`,
                    slot: slotId.id,
                    clickCount: slotClickCount,
                    type: `slot`
                });
            } else {
                columns.push(list);

                columns.push({
                    id: `ad_${utils.getUid()}`,
                    slot: slotId.id,
                    clickCount: slotClickCount,
                    type: `slot`
                });
            }
        } else {
            columns.push(list);
        }
    }
    // console.log(columns);
    return columns;
}

const loadNewRelate = function({commit, dispatch, state}, params) {
    return new Promise((resolve, reject) => {
        dataCenter.getRelateNews(params).then((data) => {
            let page = params.page;
            let lastColumns = getColumnsData(data, page);

            commit({
                type: 'SETNEWSRELATE',
                lists: lastColumns
            });
            resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};
/*
    详情页推荐api, 广告封装相关 end
*/


/*
    犀光详情页推荐api start
*/
const loadXiGuangNewRelate = function({commit, dispatch, state}, params) {
    return new Promise((resolve, reject) => {
        dataCenter.xiGuangDetailRelate(params).then((data) => {
            let page = params.page;
            let lastColumns = getColumnsData(data, page);

            commit({
                type: 'SETNEWSRELATE',
                lists: lastColumns
            });
            resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};
/*
    犀光详情页推荐 start
*/

/*
    犀光详情页api start
*/
const getXiGuangDetailItem = function({commit, dispatch, state}, params) {
    return new Promise((resolve, reject) => {
        dataCenter.xiGuangDetail(params).then((data) => {

            commit({
                type: 'SETDETAIL',
                detail: data
            })
            resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};
/*
    犀光详情页api  end
*/
export default {
    getDetailItem,
    loadNewRelate,
    getXiGuangDetailItem,
    loadXiGuangNewRelate
};
