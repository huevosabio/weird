
// Use Parse.Cloud.define to define as many cloud functions as you want.

var Image = require("parse-image");

 
Parse.Cloud.beforeSave("Meal", function(request, response) {
  Parse.Cloud.useMasterKey();
  var picture = request.object;
  var Pictures = Parse.Object.extend("Meal");
  var query = new Parse.Query(Pictures);
  query.include("author");
  
  if (!picture.get("photo")) {
   response.error("NO PHOTO UPLOADED!");
  }
  
  if (!picture.isNew()) {
    // The picture isn't being modified
    //Let's check the 
    if (!picture.has("likes")){
      picture.set("likes",[]);
    }
    if (!picture.dirty("likes")){
      query.get(picture.id, {
        success: function(object) {
          var user = object.get("author");
          var likes = picture.get("likes");
          for (var i = 0; i < likes.length; i++) {
            user.addUnique("likers",likes[i]);
          }
          user.save().then(function(){
            response.success();
          },function(error){
            response.error(error);
          });
        },
        error: function(object, error) {
          response.error(error);
        }});
    return;
    }
  }
  
  Parse.Cloud.httpRequest({
    url: picture.get("photo").url()
 
  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
 
  }).then(function(image) {
    // Crop the image to the smaller of width or height.
    var size = Math.min(image.width(), image.height());
    return image.crop({
      left: 0,
      top: 0,
      width: size,
      height: size
    });
 
  }).then(function(image) {
    // Make sure it's a JPEG to save disk space and bandwidth.
    return image.setFormat("JPEG");
 
  }).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();
 
  }).then(function(buffer) {
    // Save the image into a new file.
    var base64 = buffer.toString("base64");
    var cropped = new Parse.File("picture.jpg", { base64: base64 });
    return cropped.save();
 
  }).then(function(cropped) {
    // Attach the image file to the original object.
    picture.set("photo", cropped);
 
  }).then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.beforeSave(Parse.User, function(request,response){
  var user = request.object;
  
  if (!user.isNew()) {
    //This isn't a new profile
    response.success();
    return;
  }
  
  //user.set("likers",[]);
  response.success();
  return;
  
});


Parse.Cloud.job("soon", function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "Prepare, just one hour left!"
    }
    });
});

Parse.Cloud.job("ending", function(request, status) {
  // Set up to modify user data
  Parse.Push.send({
     where: new Parse.Query(Parse.Installation),
     data: {
          alert: "One last hour!"
    }
    });
});

