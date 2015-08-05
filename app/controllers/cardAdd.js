var group = arguments[0] || {};

$.save_button.addEventListener('click', function(_e) {
	var dateInMillesecounds =Number(new Date());
	Ti.API.info('dateInMillesecounds:' + dateInMillesecounds);
	dateInMillesecounds += 1000 * 60*5;
	Ti.API.info('dateInMillesecounds with five minutes:' + dateInMillesecounds);
    var cardModel = Alloy.createModel("Card", {
        card_title : $.title_tf.value,
        card_description: $.description_ta.value,
        card_finished:$.finished_sw.value ? 1:0,
        card_date_reminder:Number(dateInMillesecounds),
        group_id:group.get('group_id') 
        
    });
	if (cardModel.get('card_title').trim() == '' ){
		alert(L('error_group_name'));	
	}else{
		cardModel.save();
    
    	Alloy.Collections.Card.fetch();

    	$.cardAddWindow.close();	
	}	
    
});