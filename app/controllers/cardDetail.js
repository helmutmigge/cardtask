var card = arguments[0] || {};

$.title_tf.value = card.get('card_title');
$.description_ta.value = card.get('card_description');
if (card.get('card_url')) {
	$.image.image = card.get('card_url');
}
$.save_button.addEventListener('click', function(_e) {

	if ($.title_tf.value.trim() == '') {
		alert(L('error_group_name'));
	} else {
		card.set('card_title', $.title_tf.value);
		card.set('card_description', $.description_ta.value);
		card.set('card_finished', $.finished_sw.value ? 1 : 0);
		if ($.finished_sw.value) {
			var dateInMillesecounds = Number(new Date());
			Ti.API.info('dateInMillesecounds:' + dateInMillesecounds);
			dateInMillesecounds += 1000 * 60 * 5;
			Ti.API.info('dateInMillesecounds with five minutes:' + dateInMillesecounds);
			card.set('card_date_reminder', dateInMillesecounds);

		} else {
			card.set('card_date_reminder', 0);
		}

		card.save();
		if (card.get('card_finished')) {
			startNotification(card);
		}
		Alloy.Collections.Card.fetch();

		$.cardDetailWindow.close();
	}

});

$.image_button.addEventListener('click', function(_e) {
	var cameraOptions = {
		success : function(event) {
			var image = event.media.imageAsResized(1032, 508);

			// set image on window
			$.image.image = image;

			//save for future use
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'photo' + card.get("card_id") + '.png');
			f.write(image);

			card.set('card_url', f.nativePath);
			card.save();

			// force tables to update
			Alloy.Collections.Card.fetch();

		},
		cancel : function() {
			// cancel and close window
		},
		error : function(error) {
			var a = Ti.UI.createAlertDialog({
				title : "Camera Error"
			});
			if (error.code == Ti.Media.NO_CAMERA) {
				a.setMessage("MISSING CAMERA");
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery : true,
		allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	};

	// display camera OR gallery
	if (Ti.Media.isCameraSupported) {
		Ti.Media.showCamera(cameraOptions);
	} else {
		Ti.Media.openPhotoGallery(cameraOptions);
	}

});
function deleteCard(e) {
	card.destroy();

	// force tables to update
	Alloy.Collections.Card.fetch();

	//on android, give a bit of a delay before closing the window...
	if (OS_ANDROID) {
		setTimeout(function() {
			$.cardDetailWindow.close();
		}, 2000);
	}
}

function startNotification(card) {
	if (OS_ANDROID) {
		var notification = Titanium.Android.createNotification({
			contentTitle : L('reminder_schedule'),
			contentText : card.get('card_title'),
			// Blank intent that will remove the notification when the user taps it
			// Do not override the default value of the 'flags' property
			contentIntent : Ti.Android.createPendingIntent({
				intent : Ti.Android.createIntent({})
			}),
			icon : Ti.App.Android.R.drawable.warn,
			number : card.get('card_id'),
			when : new Date(Number(card.get('card_date_reminder')))
		});
		Ti.API.info('agendando notificação - ' + new Date(Number(card.get('card_date_reminder'))) );
		Ti.Android.NotificationManager.notify(card.get('card_id'), notification);
	}
}
