var group = arguments[0] || {};

function dataCardTransformation(_model) {
	Ti.API.info(JSON.stringify(_model));
	var transform = _model.toJSON();
	Ti.API.info('transform:' + JSON.stringify(transform));
	if (transform.card_finished && transform.card_date_reminder > 0) {

		var dateReminder = new Date(Number(transform.card_date_reminder));
		//transform.reminder_text =  dateReminder.toLocaleDateString() + " - " + dateReminder.toLocaleTimeString();
		transform.reminder_text = String.format(L('remember_in'),String.formatDate(dateReminder) + " " + String.formatTime(dateReminder));
	} else {
		transform.reminder_text = L('not_reminder');
	}
	return transform;
}

function addCard(e) {
	Ti.API.info(JSON.stringify(group));
	var ctrl = Alloy.createController('cardAdd', group);
	Ti.API.info(JSON.stringify(ctrl));
	var win = ctrl.getView();
	win.open();
}

function filterCards(collection) {
	var groupId = group.get('group_id');
	Ti.API.info('groupId:' + groupId);
	return collection.where({
		'group_id' : groupId
	});
}

function deleteGroup(e) {
	// delete the model object
	group.destroy();

	// force tables to update
	Alloy.Collections.Group.fetch();

	//on android, give a bit of a delay before closing the window...
	if (OS_ANDROID) {
		setTimeout(function() {
			$.groupDetailWindow.close();
		}, 2000);
	}

}

$.table.addEventListener('click', function(e) {	
	Ti.API.info( "id ["+e.rowData.model+ "]");
	var card = Alloy.Collections.Card.get(e.rowData.model);
	Ti.API.info( JSON.stringify(card));
	var ctrl = Alloy.createController('cardDetail', card);
	
	ctrl.getView().addEventListener('open', function() {
		if (OS_ANDROID) {
			// for android actionbar
			var activity = ctrl.getView().getActivity();
			if (activity != undefined && activity.actionBar != undefined) {
				activity.actionBar.displayHomeAsUp = true;
				activity.actionBar.title = L('title_card_detail');
			}

			activity.actionBar.onHomeIconItemSelected = function() {
				Ti.API.info("Home clicked!");
				ctrl.getView().close();
			};
		}
	});
	
	var win = ctrl.getView();
	win.open();	
});

Alloy.Collections.Card.fetch();
