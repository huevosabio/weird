
// Use Parse.Cloud.define to define as many cloud functions as you want.

//Collections
var picture = require("cloud/picture.js");
Parse.Cloud.beforeSave("Meal", picture.crop);
var messages = require("cloud/messages.js");
Parse.Cloud.beforeSave("ParseMessage", messages.notify);

//Jobs
var jobs = require("cloud/jobs.js");
Parse.Cloud.job("openingSoon", jobs.openingSoon);
Parse.Cloud.job("endingSoon", jobs.endingSoon);
Parse.Cloud.job("matched", jobs.matched);

//Functions
var matching = require("cloud/matching.js");
Parse.Cloud.define("match", matching.match);
Parse.Cloud.define("answer", matching.answer);
