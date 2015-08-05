
function addGroup(e){
	var crtl = Alloy.createController('groupAdd');
	var win = crtl.getView();
	win.open();	
} 

$.table.addEventListener('click', function(e) {	
	Ti.API.info( "id ["+e.rowData.model+ "]");
	var group = Alloy.Collections.Group.get(e.rowData.model);
	Ti.API.info( JSON.stringify(group));
	var ctrl = Alloy.createController('groupDetail', group);
	
	ctrl.getView().addEventListener('open', function() {
		if (OS_ANDROID) {
			// for android actionbar
			var activity = ctrl.getView().getActivity();
			if (activity != undefined && activity.actionBar != undefined) {
				activity.actionBar.displayHomeAsUp = true;
				activity.actionBar.title = group.get('group_name');
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



$.index.open(); 

Alloy.Collections.Group.fetch();
