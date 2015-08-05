var args = arguments[0] || {};

$.save_button.addEventListener('click', function(_e) {

    var groupModel = Alloy.createModel("Group", {
        group_name : $.name_tf.value
    });
	if (groupModel.get('group_name').trim() == '' ){
		alert(L('error_group_name'));	
	}else{
		groupModel.save();
    
    	Alloy.Collections.Group.fetch();

    	$.groupAddWindow.close();	
	}	
    
});