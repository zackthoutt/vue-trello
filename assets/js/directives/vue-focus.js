Vue.directive('focus', {
	priority: 1000,

	bind: function() {
		var self = this;
		this.bound = true;

		this.focus = function() {
	 		if (self.bound === true) {
				self.el.focus();
	 		}
		};

		this.blur = function() {
	 		if (self.bound === true) {
				self.el.blur();
	 		}
		};
	},

	update: function(value) {
		if (value) {
			Vue.nextTick(this.focus);
		} else {
			Vue.nextTick(this.blur);
		}
	},

	unbind: function() {
		this.bound = false;
	},
});