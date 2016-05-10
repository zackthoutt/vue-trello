Vue.directive('drag-and-drop', {
	params: [
	'drag-and-drop',
	'drag-start',
	'drag-enter',
	'drag-end',
	'drag-leave',
	'drag-type',
	'drop'
	],
	bind: function () {
		// use the VM so we only have 1 dragging item per app
		var that = this;
		if (!that.vm._dragSrcEl) {
			that.vm._dragSrcEl = null;
		}
		this.handleDragStart = function (e) {
			if (e.target.dataset.dragType == that.params.dragType) {
				that.vm._dragSrcEl = e.target;
				currentTarget = e.target;
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('text', '*');
				if (typeof(that.vm[that.params.dragStart]) === 'function') {
					that.vm[that.params.dragStart].call(that, e.target);
				}
			}
		};
		this.handleDragOver = function(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.dataTransfer.dropEffect = 'move';
			if (typeof(that.vm[that.params.dragOver]) === 'function') {
				that.vm[that.params.dragOver].call(that, e.target);
			}
			return false;
		};
		this.handleDragEnter = function(e) {
			if (e.target.dataset.dragType == currentTarget.dataset.dragType && e.target.dataset.dragType == that.params.dragType) {
				e.dataTransfer.dropEffect = 'move';
				if (currentTarget != null) {
					currentTarget.classList.remove('current-target');
				}
				currentTarget = e.target
				if (typeof(that.vm[that.params.dragEnter]) === 'function') {
					that.vm[that.params.dragEnter].call(that, e.target);
				}
				e.target.classList.add('current-target');
			}
		};
		this.handleDragLeave = function(e) {
			if (typeof(that.vm[that.params.dragLeave]) === 'function') {
				that.vm[that.params.dragLeave].call(that, e.target);
			}
		};
		this.handleDragEnd = function(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			currentTarget.classList.remove('current-target');
			if (typeof(that.vm[that.params.dragEnd]) === 'function') {
				that.vm[that.params.dragEnd].call(that, e.target);
			}
		};
		this.handleDrop = function(e) {
			if (e.stopPropagation) {
				// stops the browser from redirecting.
				e.stopPropagation();
			}
			// Don't do anything if dropping the same column we're dragging.
			if (that.vm._dragSrcEl != e.target) {
				if (typeof(that.vm[that.params.drop]) === 'function') {
					var el = (e.target.draggable) ? e.target : e.target.parentElement;
					that.vm[that.params.drop].call(that, that.vm._dragSrcEl, el);
					currentTarget.classList.remove('current-target');
				}
			}
			return false;
		};
		// setup the listeners
		this.el.setAttribute('draggable', 'true');
		this.el.addEventListener('dragstart', this.handleDragStart, false);
		this.el.addEventListener('dragenter', this.handleDragEnter, false);
		this.el.addEventListener('dragover', this.handleDragOver, false);
		this.el.addEventListener('dragleave', this.handleDragLeave, false);
		this.el.addEventListener('drop', this.handleDrop, false);
		this.el.addEventListener('dragend', this.handleDragEnd, false);
	},
	unbind: function () {
		this.el.classList.remove('current-target');
		this.el.removeAttribute('draggable');
		this.el.removeEventListener('dragstart', this.handleDragStart);
		this.el.removeEventListener('dragenter', this.handleDragEnter);
		this.el.removeEventListener('dragover', this.handleDragOver);
		this.el.removeEventListener('dragleave', this.handleDragLeave);
	}
});
