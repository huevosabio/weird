Parse.Cloud.job("matches", function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "Just one hour left!"
    }
    });
});