
exports.openingSoon = function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "Prepare, doors open in one hour!"
    }
    });
}

exports.endingSoon = function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "Last Call! Doors close in one hour!"
    }
    });
};


exports.matched = function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "Congrats! You got matched! Start chatting now."
    }
    });
};