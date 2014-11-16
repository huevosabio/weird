
// Use Parse.Cloud.define to define as many cloud functions as you want.

var Image = require("parse-image");
var Pictures = Parse.Object.extend("Meal");
 
exports.crop = function(request, response) {
  Parse.Cloud.useMasterKey();
  var picture = request.object;
  var query = new Parse.Query(Pictures);
  query.include("author");
  
  if (!picture.get("photo")) {
   response.error("NO PHOTO UPLOADED!");
  }
  
  if (!picture.isNew()) {
    response.success();
    return;
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
};