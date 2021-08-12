import utils from '@/utils/';
export default {

    ADDLIST(state, {lists}) {
    	let list = new Array();
    	lists.forEach((item, index) => {
    		state.channleList.push(item);
    	})
    },
    ADDXIGUANGLIST(state, {lists}) {
    	let list = new Array();
    	lists.forEach((item, index) => {
    		if(item.pub_time) {
    			item.pub_times = utils.formatMsgTime(item.pub_time);
    		}
            if(!item.adslot_id) {
                state.channleList.push(item);
            }
    	})
    },
    CLEARLIST(state) {
    	state.channleList = [];
    }
};