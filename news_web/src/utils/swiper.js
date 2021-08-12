import storage from '@/utils/storage.js';
function Swiper(el, flag, direction) {
	this.$el = el;
	this.flag = flag;//表示是否需要遍历子元素去计算父容器的宽度
	// this.parent = el.parentNode;
	// this.direction = direction;
	this.startPos = {};
	this.movePos = {};
	this.leftPos = 0;
	this.maxLeftPos = 0;
	this.containerW = 0;
	this.boxW = 0;
	this.init();
}

Swiper.prototype = {
	init: function() {
		this.containerWidth();
		this.$el.addEventListener('touchstart', this.touchstart.bind(this), false);
		this.$el.addEventListener('touchmove', this.touchmove.bind(this), false);
		this.$el.addEventListener('touchend', this.touchend.bind(this), false);
	},
	touchstart: function(e) {
		this.startPos = {
			x: e.touches[0].pageX,
			y: e.touches[0].pageY
		};
	},
	touchmove: function(e) {
		e.preventDefault();
		this.movePos = {
			x: e.touches[0].pageX - this.startPos.x,
			y: e.touches[0].pageY - this.startPos.y
		};

		this.$el.style.webkitTransform = `translate(${this.limitMoveRange(this.leftPos + this.movePos.x)}px, 0)`;
	},
	touchend: function() {
		this.leftPos = this.limitMoveRange(this.movePos.x + this.leftPos);
	},
	containerWidth: function() {
		let children = this.$el.children;
		let itemWidth = children[0].offsetWidth;
		let margin = parseInt(window.getComputedStyle(children[0], null).getPropertyValue('margin-right'));

		this.containerW = (this.flag ? this.mapChild([...children]) + 5 : itemWidth * children.length) + margin * children.length;
		// 这里的5表示计算宽度的大致误差
		this.$el.style.cssText = `width: ${this.containerW}px;${storage.getSession('navTransform')}`;

		this.boxW = this.$el.parentNode.offsetWidth;

		this.maxLeftPos = this.containerW - this.boxW;
	},
	mapChild: function(children) {
		let w = 0;
		children.map((item, index) => {
			w += item.offsetWidth;
		});
		return w;
	},
	limitMoveRange: function(value) {
		if(value >= 0) return 0;
		else if(Math.abs(value) >= this.maxLeftPos) return - (this.containerW - this.boxW);
		else return value;
	}
};

export default Swiper;