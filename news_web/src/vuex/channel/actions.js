import dataCenter from '@/store/index.js';
import utils from '@/utils/index.js';

let ads = window.config.adList;
let listCount = 0, adIntervalIndex = 0, middleIntervalIndex = 0, isListStartSlot = true, flag = true;
let listStartAdId = ads.listStart && ads.listStart.id ? ads.listStart.id.split(',') : null;
let listStartAdInterval = listStartAdId && ads.listStart.interval ? ads.listStart.interval.split(',') : null;
let listStartAdClickCount = listStartAdId && ads.listStart.adClickTime ? ads.listStart.adClickTime.split(',') : 0;
let listMiddleAdId = ads.listMiddle && ads.listMiddle.id ? ads.listMiddle.id.split(',') : null;
let listMiddleAdInterval = listMiddleAdId && ads.listMiddle.interval ? ads.listMiddle.interval.split(',') : null;
let listMiddleAdClick = listMiddleAdId && ads.listMiddle.adClickTime ? ads.listMiddle.adClickTime.split(',') : 0;

function getSlotInfo() {
    if(isListStartSlot && listStartAdId && listStartAdId[adIntervalIndex]) {
        return {id: listStartAdId[adIntervalIndex], interval: parseInt(listStartAdInterval[adIntervalIndex]), clickCount: listStartAdClickCount[adIntervalIndex], pos: 'listStart'};
    } else if (listMiddleAdId) {
        if(isListStartSlot) {
            isListStartSlot = false;
            adIntervalIndex = 0;
        }
        return {id: listMiddleAdId[adIntervalIndex], interval: parseInt(listMiddleAdInterval[adIntervalIndex]), clickCount: listMiddleAdClick[adIntervalIndex],  pos: 'listMiddle'};
    }
}

function getColumnsData(data, page) {
	if(page == 1) {
        listCount = 0;
    }
    let columns = [];

    for(let i = 0; i < data.length; i++) {
        listCount++;
        let list = data[i];


        let slotInfo = getSlotInfo();
        if(slotInfo && !slotInfo.id) {
            isListStartSlot = false;
            adIntervalIndex = 0;
        }
        if(slotInfo && (slotInfo.interval === 0 || listCount % slotInfo.interval === 0)) {
            listCount = 0;
            adIntervalIndex++;
            if(slotInfo.interval === 0) {
                columns.push({
                    id: `ad_${utils.getUid()}`,
                    slot: slotInfo.id,
                    pos: slotInfo.pos,
                    clickCount: slotInfo.clickCount,
                    type: `slot`
                });
            } else if(slotInfo.interval === 1 && slotInfo.pos == 'listMiddle') {
                if(flag && adIntervalIndex == 1) {
                    columns.push(list);
                    flag = false;
                }
                if(adIntervalIndex != 1) {
                    columns.push(list);
                }
                columns.push({
                    id: `ad_${utils.getUid()}`,
                    slot: slotInfo.id,
                    pos: slotInfo.pos,
                    clickCount: slotInfo.clickCount,
                    type: `slot`
                });
            } else {
                columns.push(list);
                columns.push({
                    id: `ad_${utils.getUid()}`,
                    slot: slotInfo.id,
                    pos: slotInfo.pos,
                    clickCount: slotInfo.clickCount,
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

const fetch = function({commit, dispatch, state}, params) {
	return new Promise((resolve, reject) => {
        dataCenter.getChannelList(params).then((data) => {
        	let page = params.page;
        	let lastColumns = getColumnsData(data, page);

 			commit({
 				type: 'ADDLIST',
 				lists: lastColumns
 			});
 			resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};

const xiGuangFetch = function({commit, dispatch, state}, params) {
    return new Promise((resolve, reject) => {
        dataCenter.xiGuangChannelList(params).then((data) => {
            let page = params.page;
            let list = [];
            data.forEach((item, index) => {
                if(!item.adslot_id) {
                    list.push(item);
                }
            })
            let lastColumns = getColumnsData(list, page);

            commit({
                type: 'ADDXIGUANGLIST',
                lists: lastColumns
            });
            resolve(data);
        }, (status) => {
            reject(status);
        });
    });
};

export default {
    fetch,
    xiGuangFetch
};
