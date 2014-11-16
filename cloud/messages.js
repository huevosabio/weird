var Messages = Parse.Object.extend("ParseMessage");

exports.notify = function(request,response){
	var toName;
	var fromName;
	var message = request.object;
	var toUser = new Parse.User({id:message.get('recipientId')});
	var fromUser = new Parse.User({id:message.get('senderId')});

	toUser.fetch().then(function(user){
		var toName = user.get('username');
		fromUser.fetch().then(function(user){
			var fromName = user.get('username');
			return [toName,fromName];
		},function(error){
			return response.error(error);
		}).then(function(names){
			response.success();
			return Parse.Push.send({
     			channels: [names[0]],
     			data: {		
          			alert: "You have a new message from " + names[1]
          		}
    		});
		});

		return
	},function(error){
		return response.error(error);
	});

};