Vue.component('board-collection', {
    template: '#trello-board-collection',
    data: function() {
    	return {
    		'boards': trelloStorage.fetchBoardCollection(),
    		'newBoard': false,
    		'newBoardTitle': '',
    	}
    },
    methods: {
    	createNewBoard: function() {
    		var newBoardTitle = this.newBoardTitle;
    		if (newBoardTitle.length > 0) {
				var boardCount = trelloStorage.fetchBoardCount();
	    		boardCount += 1;
	    		trelloStorage.saveBoardCount(boardCount);
	    		var boardKey = 'b' + boardCount;
	    		this.$set('boards.' + boardKey, {
	    			'name': newBoardTitle,
	    			'starred': false,
	    			'lists': [],
	    		});
	    		this.newBoardTitle = '';
	    		router.go('/board/' + boardKey);
    		}
    	},
    	activateNewBoard: function() {
    		if (!this.newBoard) {
    			this.newBoard = !this.newBoard;
    		}
    	},
    	updateBoardStarred: function(boardId) {
    		this.boards[boardId].starred = !this.boards[boardId].starred;
    	},
    },
    watch: {
    	boards: {
    		handler: function(boards) {
    			trelloStorage.saveBoardCollection(boards);
    		},
    		deep: true,
    	}
    },
    filters: {
    	starred: function(boards) {
    		var filteredBoards = {}
    		for (boardId in boards) {
    			var currentBoard = boards[boardId];
	    		if (currentBoard.starred) {
	    			filteredBoards[boardId] = currentBoard;
	    		}
    		}
    		return filteredBoards;
    	}
    }
});