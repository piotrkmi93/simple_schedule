/**
 * Created by Piotr Kmiecik on 11.10.2017.
 */
angular.module("schedule")
  .controller("ConfigController", function($scope, $rootScope, $window, $ionicPopup, $timeout, ScheduleService, NotificationService){

    /**
     * Object with references to variables in $rootScope
     * @type {{locale, notification_delay: *}}
     */
    $scope.config = {
      locale: $rootScope.locale,
      notification_delay: $rootScope.notification_delay
    };

    /**
     * Languages available in app
     * @type {*|Array|locales|{pl, en}}
     */
    $scope.locales = $rootScope.locales;

    /**
     * Delays available in app
     * @type {*|Array}
     */
    $scope.notificationDelays = $rootScope.notificationDelays;

    /**
     * Watcher on locale variable.
     * If it's changing, system variable is also changing.
     * Then translation tool will refresh itself and give new string values to templates.
     * Notifications will be also updated.
     */
    $scope.$watch(function(){ return $scope.config.locale; }, function(n, o){
      $rootScope.locale = $scope.config.locale;
      localStorage.setItem("locale", $scope.config.locale);
      if(o !== n){
        $rootScope.$emit("locale-ready");
        $rootScope.$emit("reload_day");
        $timeout(function(){
          NotificationService.updateAll();
        }, 1000);

      }
    });

    /**
     * Watcher on delay variable.
     * If it's changing, system variable is also changing.
     * Then notifications will update.
     */
    $scope.$watch(function(){ return $scope.config.notification_delay; }, function(n, o){
      $rootScope.notification_delay = $scope.config.notification_delay;
      localStorage.setItem("notification_delay", $scope.config.notification_delay);
      if(o !== n) {
        NotificationService.updateAll();
      }
    });

    /**
     * This function will show a popup with question, that user is sure to clear all data.
     * If he agree, all schedule and notifications will be removed.
     */
    $scope.clear = function(){
      $ionicPopup.show({
        title: $scope.trans("config.deleteButton.message"),
        subTitle: $scope.trans("config.deleteButton.sub_message"),
        buttons: [
          { text: $scope.trans("config.deleteButton.cancel") },
          {
            text: $scope.trans("config.deleteButton.confirm"),
            type: "button-assertive",
            onTap: function(){
              ScheduleService.clear();
            }
          }
        ]
      })
    }
  });
