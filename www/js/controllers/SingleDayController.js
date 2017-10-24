/**
 * Created by Piotr Kmiecik on 11.10.2017.
 */
angular.module("schedule")
  .controller("SingleDayController", function($scope, $rootScope, $stateParams, $ionicPopup, $interval, ScheduleService){

    $scope.deleteLesson = function(lesson){
      $ionicPopup.show({
        title: $scope.trans("lesson.deleteButton.message", {name: lesson.name}),
        buttons: [
          { text: $scope.trans("lesson.deleteButton.cancel") },
          {
            text: $scope.trans("lesson.deleteButton.confirm"),
            type: "button-assertive",
            onTap: function(){
              ScheduleService.delete(lesson);
              reload();
            }
          }
        ]
      })
    };

    function reload(){
      $scope.day = {
        id: $stateParams.day,
        name: $scope.trans("days." + $stateParams.day),
        lessons: $scope.clone(ScheduleService.all($stateParams.day + ".lessons", true))
      };
      setActive();
    }

    $interval(function(){
      setActive();
    }, 1000);

    function setActive(){
      var now = new Date();
      if(now.getDay() === getCurrentDayNumber())
      for(var i in $scope.day.lessons){
        $scope.day.lessons[i].active = Number($scope.day.lessons[i].start) <= now.getHours() &&
                                        Number($scope.day.lessons[i].end) > now.getHours();
        if($scope.day.lessons[i].active){
          var period = (Number($scope.day.lessons[i].end) * 3600) - (Number($scope.day.lessons[i].start) * 3600);
          var progress = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() - (Number($scope.day.lessons[i].start) * 3600);
          $scope.day.lessons[i].progress = ((period - (period - progress)) * 100) / period;
        }
      }
    }

    function getCurrentDayNumber(){
      switch($scope.day.id){
        case "monday": return 1;
        case "tuesday": return 2;
        case "wednesday": return 3;
        case "thursday": return 4;
        case "friday": return 5;
        case "saturday": return 6;
        case "sunday": return 7;
      }
    }

    $rootScope.$on("reload_day", function(e, args){
      reload();
    });

    reload();

  });
