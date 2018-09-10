$(document).ready(function () {

	$('input[type=tel]').inputmask({
		'mask': '+7 (999) 999-99-99'
	})

	$('input[type=email]').inputmask({
		'alias': 'email'
	})
	
	

	$('form').on('submit', function (e) {
		e.preventDefault();
		
		var form 			= $(this),
			data 			= $(this).serialize(),
			id 				= $(this).attr('id'),
			submitBtn 		= $(this).find('button[type="submit"]'),
			submitBtnText 	= submitBtn.text(),
			sentForms 		= JSON.parse(localStorage.getItem('sentForms'));
		
		if (!sentForms || sentForms == '') {
			sentForms = {
				"interview": false,
				"guestVisit": false,
				"gift": false,
				"callMe": false
			}
		}

//		if (id == 'interview-form' && sentForms.interview) {
//			alert('Вы уже проходили опрос!');
//			return;
//		} else if (id == 'guest-visit-form' && sentForms.guestVisit) {
//			alert('Вы уже записались на гостевой визит!');
//			$.fancybox.close();
//			return;
//		}

		
		
		$.ajax({
			type: "POST",
			url: '/mail.php',
			data: data,
			beforeSend: function () {
				submitBtn.attr('disabled', '');
				submitBtn.text('Отправка...');
			},
			error: function (error) {
				alert('Ошибка ' + error.status + '. Повторите позднее.');
				submitBtn.removeAttr('disabled');
				submitBtn.text(submitBtnText);
			},
			success: function (data) {
				submitBtn.removeAttr('disabled');
				submitBtn.text(submitBtnText);
				
				data = JSON.parse(data);
				
				var targetName = '';
				
				if (data.sended) {
					switch (id) {
						case 'call-me-form':
							$.fancybox.close();
							$.fancybox.open($('#thanks'));
							targetName = 'zvonok';
							break;
							
						// Формы(2) "Узнать подробнее" на промо-строанице 1 (/)
						case 'promo-form-1':
						case 'promo-form-2':
							$.fancybox.close();
							$.fancybox.open($('#thanks'));

							targetName = 'promo';
							break;

						// Формы(2) гостевого визита на промо-строанице 2 (/gostevoi)
						case 'guest-visit-promo-form-1':
						case 'guest-visit-promo-form-2':
							$.fancybox.close();
							$.fancybox.open($('#thanks'));

							targetName = 'gostevoi';
							break;
					}
					
					if (typeof yaCounter49611721 != 'undefined') {
						yaCounter49611721.reachGoal(targetName);
					}
//					gtag('event', 'sendforms', { 'event_category': 'zayavka', 'event_action': 'podtverdit'});
					
					form[0].reset();
					localStorage.setItem('sentForms', JSON.stringify(sentForms));

				} else {
					alert (data.message);
				}

			}
		});
	});
})