import utils from '@/utils/';
export default {

    SETDETAIL(state, {detail}) {
        if(detail.pub_time) {
            detail.pub_times = utils.formatMsgTime(detail.pub_time);
        }
    	state.detailObj = detail;
    },
    CLEARDETAIL(state) {
    	state.detailObj = {};
    },
    SETDETAILPRS(state, {detailPrs}) {
        state.detailPrs = detailPrs;
    },
    SETNEWSRELATE(state, {lists}) {
    	lists.forEach((item, index) => {

            if(item.pub_time) {
                item.pub_times = utils.formatMsgTime(item.pub_time);
            }

            if(!item.adslot_id) {
                state.newsRelateList.push(item);
            }
    	});
    },
    CLEARNEWSLATE(state) {
    	state.newsRelateList = [];
    }
};