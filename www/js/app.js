// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('schedule', ['ionic'])

.run(function($ionicPlatform, $rootScope, ScheduleService, NotificationService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.locales = ["en", "pl"]; // locales available
  if(!localStorage.hasOwnProperty("locale"))
    localStorage.setItem("locale", "en");
  $rootScope.locale = localStorage.getItem("locale");

  $rootScope.notificationDelays = ["off", "5", "10", "15"]; // delays available
  if(!localStorage.hasOwnProperty("notification_delay"))
    localStorage.setItem("notification_delay", "off");
  $rootScope.notification_delay = localStorage.getItem("notification_delay");

  ScheduleService.init();
  NotificationService.init();
});
