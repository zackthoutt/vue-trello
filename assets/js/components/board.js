Vue.component('board', {
	template: '#trello-board',
	data: function() {
		return {
			'boardId': '',
			'lists': [],
			'name': '',
			'newListTitle': "",
			'newList': false,
			'movingTask': {},
			'movingTaskId': "",
			'movingTaskHasTarget': false,
			'currentTaskTargetId': "",
			'currentListTargetId': "",
			'selectedTaskId': "",
			'selectedListId': "",
			'showTaskModule': false,
			'editTaskDescription': false,
			'inProgressTaskDescription': "",
			'movingList': {},
			'movingListId': "",
		}
	},
	ready: function() {
		var board = trelloStorage.fetchBoard(this.$route.params.boardId);
		this.lists = board['lists'];
		this.name = board['name'];
		this.boardId = this.$route.params.boardId;
	},
	watch: {
		lists: {
			handler: function(lists) {
				trelloStorage.saveBoard(this.boardId, lists);
			},
			deep: true,
		}
	},
	methods: {
		pickupTask: function(elem) {
			movingListId = elem.id.split('-')[0];
			movingTaskId = elem.id.split('-')[1];
			this.movingTaskId = elem.id;
			this.movingTask = this.lists[movingListId].tasks[movingTaskId];
			this.currentTaskTargetId = elem.id;
		},
		pickupList: function(elem) {
			this.movingListId = elem.id;
			this.movingList = this.lists[elem.id];
			this.currentListTargetId = elem.id;
		},
		addTask: function(listId) {
			var newTask = this.lists[listId].newItem;
			if (newTask.length > 0) {
				this.lists[listId].tasks.push({"title": newTask, "description": "", "placeholder": false});
				this.lists[listId].newItem = "";
			}
		},
		addList: function() {
			if (this.newListTitle.length > 0) {
				var listToAdd = {
					"title": this.newListTitle,
					"tasks": [],
					"newItem": "",
					"hasPlaceholderTask": false,
					"addTask": false,
				};
				this.lists.push(listToAdd);
				this.newListTitle= "";
			}
		},
		cancelNewList: function() {
			this.newListTitle = "";
			this.newList = false;
		},
		changeTaskTarget: function(elem) {
			var currentTaskTargetIds = this.currentTaskTargetId.split('-');
			var newTargetIds = elem.id.split('-');
			var currentTarget = {};
			var newTarget = {};
			if (currentTaskTargetIds != newTargetIds) {
				currentTarget.taskId = currentTaskTargetIds[1];
				currentTarget.listId = currentTaskTargetIds[0];
				newTarget.taskId = newTargetIds[1];
				newTarget.listId = newTargetIds[0];

				if (currentTarget.listId == newTarget.listId) {
					this.changeTaskTargetSameList(currentTarget, newTarget);
				} else {
					this.changeTaskTargetDiffList(currentTarget, newTarget);
				}
				this.currentTaskTargetId = elem.id;
			}
		},
		changeListTarget: function(elem) {
			var newTargetId = elem.id;
			var currentListTargetId = this.currentListTargetId;
			if (currentListTargetId != newTargetId) {
				this.lists.splice(currentListTargetId, 1);
				this.lists.splice(newTargetId, 0, this.movingList);
				this.currentListTargetId = newTargetId
			}
		},
		changeTaskTargetSameList: function(currentTarget, newTarget) {
			this.lists[currentTarget.listId].tasks.splice(currentTarget.taskId, 1);
			this.lists[currentTarget.listId].tasks.splice(newTarget.taskId, 0, this.movingTask);
		},
		changeTaskTargetDiffList: function(currentTarget, newTarget) {
			var movingTaskListId = this.movingTaskId.split('-')[0];
			if (currentTarget.listId == movingTaskListId && this.lists[currentTarget.listId].hasPlaceholderTask == false) {
				this.lists[movingTaskListId].hasPlaceholderTask = true;
				this.lists[movingTaskListId].tasks.push({"title":"", "description": "", "placeholder": true});
			}
			if (newTarget.listId == movingTaskListId) {
				this.lists[movingTaskListId].hasPlaceholderTask = false;
				this.lists[movingTaskListId].tasks.pop();
			}
			this.lists[currentTarget.listId].tasks.splice(currentTarget.taskId, 1);
			this.lists[newTarget.listId].tasks.splice(newTarget.taskId, 0, this.movingTask);
		},
		placeTaskInTarget: function(elem) {
			var movingTaskListId = this.movingTaskId.split('-')[0];
			var currentTarget = {};
			currentTarget.listId = this.currentTaskTargetId.split('-')[0];
			currentTarget.taskId = this.currentTaskTargetId.split('-')[1];
			if (currentTarget.listId != movingTaskListId) {
				this.lists[movingTaskListId].hasPlaceholderTask = false;
				this.lists[movingTaskListId].tasks.pop();
			}
			this.lists[currentTarget.listId].tasks.$set(currentTarget.taskId, this.movingTask);
		},
		placeListInTarget: function(elem) {
			var currentListTargetId = this.currentListTargetId;
			this.lists.$set(currentListTargetId, this.movingList);
		},
		editTask: function(listId, taskId) {
			this.showTaskModule = true;
			this.selectedTaskId = taskId;
			this.selectedListId = listId;
			this.inProgressTaskDescription = this.lists[listId].tasks[taskId].description;
		},
		cancelNewTask: function(listId) {
			this.lists[listId].addTask = false;
		},
		saveNewTaskDescription: function() {
			this.lists[this.selectedListId].tasks[this.selectedTaskId].description = this.inProgressTaskDescription;
			this.editTaskDescription = !this.editTaskDescription;
		}
	},
	computed: {
		selectedTask: function() {
			if (this.showTaskModule) {
				return this.lists[this.selectedListId].tasks[this.selectedTaskId];
			} else {
				return {"title": "", "description": "", "placeholder": false};
			}
		},
		selectedListTitle: function() {
			if (this.showTaskModule) {
				return this.lists[this.selectedListId].title;
			} else {
				return "";
			}
		},
	},
});