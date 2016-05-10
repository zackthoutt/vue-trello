Vue = require('vue');
VueRouter = require('vue-router');
Vue.use(VueRouter);

require('./../../data/seed.js');
require('./store.js');
require('./../directives/vue-focus.js');
require('./../directives/vue-dnd.js');
require('./../components/collection.js');
require('./../components/board.js');

var router = new VueRouter()

router.map({
    '/': {
        component: Vue.component('board-collection'),
    },
    '/board/:boardId': {
        component: Vue.component('board'),
    }
})

var app = Vue.extend({
	data: function() {
		return {
			'searchText': '',
			'boards': trelloStorage.fetchBoardCollection(),
			'newBoard': '',
		}
	},
})

router.start(app, '#trello-app')

