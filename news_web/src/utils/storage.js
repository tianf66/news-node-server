import utils from '@/utils';
let did = utils.getDID();

let storage = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    remove: function (key) {
    	return localStorage.removeItem(key);
    },
    setSession: function(key, value) {
    	sessionStorage.setItem(key, JSON.stringify(value));
    },
    getSession: function(key) {
    	return JSON.parse(sessionStorage.getItem(key));
    },
    removeSession: function(key) {
    	return sessionStorage.removeItem(key);
    },
    setTime() {
        let t = new Date().getTime() + 24 * 60 * 60 * 1000;//24小时 * 60分钟 * 60秒 * 1000
        let d = new Date(t);
        let theMonth = d.getMonth() + 1;
        let theDate = d.getDate();
        let theHours = d.getHours();
        let theMinutes = d.getMinutes();
        if (theMonth < 10) theMonth = '0' + theMonth;
        if (theDate < 10) theDate = '0' + theDate;
        if (theHours < 10) theHours = '0' + theHours;
        if (theMinutes < 10) theMinutes = '0' + theMinutes;
        let date = `${d.getFullYear()}${theMonth}${theDate}`;
        let time = `${theHours}${theMinutes}`;
        let Spare = `${date}${time}`;
        return Spare;
    },
    getTime() {
        let d = new Date();
        let theMonth = d.getMonth() + 1;
        let theDate = d.getDate();
        let theHours = d.getHours();
        let theMinutes = d.getMinutes();
        if (theMonth < 10) theMonth = '0' + theMonth;
        if (theDate < 10) theDate = '0' + theDate;
        if (theHours < 10) theHours = '0' + theHours;
        if (theMinutes < 10) theMinutes = '0' + theMinutes;
        let date = `${d.getFullYear()}${theMonth}${theDate}`;
        let time = `${theHours}${theMinutes}`;
        let spare = `${date}${time}`;
        return parseInt(spare);
    },
    setAdClk: function(key, value, clickCount) {
        if(value && value > clickCount) {
            // localStorage.setItem(key, JSON.stringify({data:value, time: this.setTime()}));
            // window.location.reload();
            return 'reload';
        } else if(value <= clickCount) {
            localStorage.setItem(key, JSON.stringify({data:value, time: this.setTime()}));
        }

    },
    getAdStatus: function(key, clickCount) {
        let data = JSON.parse(localStorage.getItem(key));
        if(data && parseInt(data.time) < this.getTime()) {
            localStorage.removeItem(key);
            return false;
        } else if(data && data.data >= clickCount) {
            return true;
        } else {
            return false;
        }
    }
};

export default storage;


