
// Use Parse.Cloud.define to define as many cloud functions as you want.

var Image = require("parse-image");
 
Parse.Cloud.beforeSave("Picture", function(request, response) {
  var pic = request.object;
  if (!pic.get("picture")) {
    response.error("No file uploaded!");
    return;
  }
  
  if (pic.dirty("picture")) {
    // The picture isn't being modified
    CropImage(pic);
    response.success();
    return;
  }
  
  
});
  
 
 
function CropImage(picture){ 
  Parse.Cloud.httpRequest({
    url: picture.get("picture").url()
 
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
    picture.set("picture", cropped);
 
  }).then(function(result) {
    return;
  }, function(error) {
    response.error(error);
  });
}