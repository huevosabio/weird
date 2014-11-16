var WeirdRequest = Parse.Object.extend("WeirdRequest");

exports.match = function(request,response){

	//Request params only requires the user to be matched
	//Request should also contain the user pointer

	//Let's use master controls 
	Parse.Cloud.useMasterKey();

	//TODO: return error if request doesn ot include the requesting user

	//Get the User objects
	var toUser = new Parse.User({id:request.params.to})
	var fromUser = new Parse.User({id:request.params.from});

	//Check existence of request
	var query1 = new Parse.Query(WeirdRequest);
	console.log(fromUser.id);
	query1.equalTo("from", fromUser).equalTo("to", toUser);
	var query2 = new Parse.Query(WeirdRequest);
	query2.equalTo("from", toUser).equalTo("to", fromUser);
	var compoundQuery = Parse.Query.or(query1,query2);
	compoundQuery.find({
		success: function(weirdRequests){
			if (weirdRequests.length > 0){
				return response.success();
			} else {
				//Create Request object saving the userids
				var weirdRequest = new WeirdRequest();
				weirdRequest.set('from',fromUser);
				weirdRequest.set('to',toUser);
				weirdRequest.set('accepted',false);
				weirdRequest.set('answered',false);
				weirdRequest.save();

				fromUser.fetch()
				.then(function(user){
					return user.get('username');
				},function(error){
					return response.error(error);
					console.log(error);
				}).then(function(username){
					toUser.fetch().then(function(receiver){
						response.success();
						return Parse.Push.send({
     						channels: [receiver.get('username')],
     						data: {		
          						alert: username +" wants to get weird!"
    						}
    					});
					})
				},function(error){
					return response.error(error);
					console.log(error);
				});

			}
		},
		error: function(error){
			return response.error(error);
			return console.log(error);
		}
	});

}


exports.answer = function(request,response){
	var query = new Parse.Query(WeirdRequest);
	query.equalTo("objectId",request.params.requestId);
	query.find({
		success: function(weirdRequests){
			if (weirdRequests.length > 0){
				var wReq = weirdRequests[0];
				console.log(wReq);
				console.log(request.params.answer);
				wReq.set("answered",true);
				wReq.set("accepted",(request.params.answer === 'true'));
				wReq.save();
				return response.success();
			} else {
				return response.error("No such request");
			}
		},
		error: function(error){
			return response.error(error);
		}
	});
}