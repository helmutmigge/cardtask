var group = arguments[0] || {};

function dataCardTransformation(_model) {
	Ti.API.info(JSON.stringify(_model));
	var transform = _model.toJSON();
	Ti.API.info('transform:' + JSON.stringify(transform));
	if (transform.card_finished && transform.card_date_reminder > 0) {

		var dateReminder = new Date(transform.card_date_reminder);
		transform.reminder_text =  dateReminder.toLocaleDateString() + " - " + dateReminder.toLocaleTimeString();

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

Alloy.Collections.Card.fetch();
