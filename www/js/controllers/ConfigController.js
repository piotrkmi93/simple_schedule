/**
 * Created by Piotr Kmiecik on 11.10.2017.
 */
angular.module("schedule")
  .controller("ConfigController", function($scope, $rootScope, $window){

    $scope.config = {
      locale: $rootScope.locale,
      notification_delay: $rootScope.notification_delay
    };

    $scope.locales = $rootScope.locales;
    $scope.notificationDelays = $rootScope.notificationDelays;

    $scope.$watch(function(){ return $scope.config.locale; }, function(n, o){
      $rootScope.locale = $scope.config.locale;
      localStorage.setItem("locale", $scope.config.locale);
      if(o !== n)
        $window.location.reload(true);
    });

    $scope.$watch(function(){ return $scope.config.locale; }, function(n, o){
      $rootScope.notification_delay = $scope.config.notification_delay;
      localStorage.setItem("notification_delay", $scope.config.notification_delay);
    });
  });
