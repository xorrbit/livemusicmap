/*
Sample use:
var loc = new LocationFinder(-41.29247, 174.7732);
$.when(loc.findUserLocationAsync()).then(function (lat, lng) {
// console.log("Lat & lng set as: ", loc.usersPosition())
});
*/
var LocationFinder = (function ($) {
"use strict";
 
return function (fallbackLat, fallbackLng) {
// Private
var lat = fallbackLat,
lng = fallbackLng,
$dfd = new $.Deferred(),
userLocationNotFound = function () {
// window.console.warn("User Location NOT found. Set to fallback: " + lat + ", " + lng);
$dfd.resolve(fallbackLat, fallbackLng);
},
me = {};
 
// Public
me.usersPosition = function () {
return {
lat: lat,
lng: lng
};
};
 
// Async method which returns a promise that resolves when the current users geolocation is found
me.findUserLocationAsync = function () {
var $html = $('html'),
isOldIe = $html.hasClass('no-geolocation') || $html.hasClass('ie8') || $html.hasClass('lt-ie9');
 
/*global window */
if (window.navigator.geolocation && !isOldIe) {
 
var geoOptions = {
enableHighAccuracy: false,
timeout: 5000, // Wait 5 seconds
maximumAge: 300000 // Valid for 5 minutes
};
 
window.navigator.geolocation.getCurrentPosition(function (position) {
lat = position.coords.latitude;
lng = position.coords.longitude;
//window.console.info("User confirmed! Location found: " + lat + ", " + lng);
// location has been found. So set $deferredObject to resolved so dependant functions can run
$dfd.resolve(lat, lng);
}, function () {
//window.console.log("User declined!");
userLocationNotFound();
}, geoOptions);
 
setTimeout(function () {
if ($dfd.state() !== "resolved") {
//window.console.log("No confirmation from user, using fallback");
userLocationNotFound();
}
}, geoOptions.timeout + 1000);
 
 
} else {
userLocationNotFound();
}
 
return $dfd.promise();
};
 
return me;
};
}(window.jQuery)); 
