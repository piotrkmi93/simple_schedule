/**
 * Created by Piotr Kmiecik on 10.10.2017.
 */
angular.module("schedule")
  .controller("AppController", function($scope, $ionicPlatform, $ionicScrollDelegate, $state, trans){

    /**
     * Using for searching translations in views and all controllers
     * @type {*}
     */
    $scope.trans = trans;

    /**
     * Color of title in nav-bar.
     * @type {{color: string}}
     */
    $scope.color = {"color": "#FFFFFF"};

    /**
     * Size of title h1.
     * @type {{font-size: string}}
     */
    $scope.titleSize = {"font-size": "36px"};

    /**
     * Function is call when user is scrolling a page.
     * If h1 title is hidden under nav-bar - title in nav-bar is showing.
     * If user is scrolling down - h1 title size is getting larger.
     * This is for make an animation like on iOS 11.
     */
    $scope.scroll = function(){
      if($ionicScrollDelegate.getScrollPosition().top >= 43) {
        $scope.$apply(function () {
          $scope.color = {"color": "#000000"};
        });
      } else {
        $scope.$apply(function () {
          $scope.color = {"color": "#FFFFFF"};
          var y = 36 - parseInt($ionicScrollDelegate.getScrollPosition().top) * 0.15;
          if(y <= 44 && y >= 36)
            $scope.titleSize = {"font-size": y+"px"};
        });
      }
    };

    /**
     * Taking a state and optional params.
     * Changes state of page to concrete view.
     * @param state
     * @param params
     */
    $scope.route = function(state, params){
      $state.go(state, params);
    };

    /**
     * Returns format with minutes
     * @param hour
     * @returns {string}
     */
    $scope.prettyHour = function(hour){
      return hour + ":00";
    };

    /**
     * Return new instance of the same object
     * @param source
     */
    $scope.clone = function(source){
      return JSON.parse(JSON.stringify(source));
    };

    $scope.getCurrentDayNumber = function(id){
      switch(id){
        case "monday": return 1;
        case "tuesday": return 2;
        case "wednesday": return 3;
        case "thursday": return 4;
        case "friday": return 5;
        case "saturday": return 6;
        case "sunday": return 7;
      }
    };

  });
