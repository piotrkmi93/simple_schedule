/**
 * Created by Piotr Kmiecik on 11.10.2017.
 */
angular.module("schedule")
  .controller("LessonController", function($scope, $rootScope, $timeout, $stateParams, ScheduleService){

    /**
     * Init
     */
    init();

    /**
     * Init function.
     * Creates empty lesson.
     */
    function init(){
      $scope.backup = undefined;
      var day = $scope.clone(ScheduleService.all($stateParams.day));
      $scope.availableStartHours = day.availableStartHours;
      $scope.availableEndHours = day.availableEndHours;
      if(typeof $stateParams.id !== "undefined" && $stateParams.id.length){
        $scope.lesson = $scope.clone(ScheduleService.get($stateParams.day, Number($stateParams.id)));
        fixHours();
      } else {
        $scope.lesson = {
          day: $stateParams.day,
          name: undefined,
          type: "lecture",
          room: undefined,
          leader: undefined,
          institute: undefined,
          start: String($scope.availableStartHours[0]),
          end: String($scope.availableEndHours[0])
        };
      }
    }

    /**
     * Watcher on start hour.
     * If it's higher than end hour, end hour will be incremented while it's higher.
     */
    $scope.$watch(function(){return $scope.lesson.start}, function(){
      var i = 0;
      if(!checkRange()){
        $scope.lesson.end = $scope.availableEndHours[$scope.availableStartHours.indexOf($scope.lesson.start)];
      }
      else while(Number($scope.lesson.start) >= Number($scope.lesson.end)){
        $scope.lesson.end = $scope.availableEndHours[++i];
      }
    });

    /**
     * Watcher on end hour.
     * If it's lower than start hour, start hour will be decremented while it's lower.
     */
    $scope.$watch(function(){return $scope.lesson.end}, function(){
      var i = $scope.availableStartHours.length - 1;
      if(!checkRange()){
        $scope.lesson.start = $scope.availableStartHours[$scope.availableEndHours.indexOf($scope.lesson.end)];
      }
      else while(Number($scope.lesson.end) <= Number($scope.lesson.start)){
        $scope.lesson.start = $scope.availableStartHours[--i];
      }

    });

    function checkRange(){
      for(var i=Number($scope.lesson.start); i<Number($scope.lesson.end); ++i)
        if(!~$scope.availableStartHours.indexOf(String(i)))
          return false;
      return true;
    }

    $scope.save = function(){
      if($scope.valid()){
        if($scope.lesson.hasOwnProperty("id")) ScheduleService.update($scope.lesson);
        else ScheduleService.create($scope.lesson);
        $rootScope.$emit("reload_day");
        $scope.route("day", {day: $stateParams.day});
      }
    };

    $scope.valid = function(){
      return  typeof $scope.lesson !== "undefined" && $scope.lesson.day !== "undefined" &&
              typeof $scope.lesson.name !== "undefined" && $scope.lesson.name.length &&
              typeof $scope.lesson.type !== "undefined" && $scope.lesson.type.length &&
              typeof $scope.lesson.room !== "undefined" && $scope.lesson.room.length &&
              typeof $scope.lesson.leader !== "undefined" && $scope.lesson.leader.length &&
              typeof $scope.lesson.start !== "undefined" && $scope.lesson.start.length &&
              typeof $scope.lesson.end !== "undefined" && $scope.lesson.end.length &&
              Number($scope.lesson.start) < Number($scope.lesson.end);
    };

    /**
     * Using when form loads existing lesson.
     * This function pushes hours of lesson and sort them.
     */
    function fixHours(){
      for(var i=Number($scope.lesson.start); i<=Number($scope.lesson.end); ++i){
        if(i < Number($scope.lesson.end)) $scope.availableStartHours.push(String(i));
        if(i > Number($scope.lesson.start)) $scope.availableEndHours.push(String(i));
      }
      var sort = function(a, b){ return Number(a) - Number(b); };
      $scope.availableStartHours.sort(sort);
      $scope.availableEndHours.sort(sort);
    }

    /**
     * Back to the day view
     */
    $scope.back = function(){
      $rootScope.$emit("reload_day");
      $scope.route('day', {day: $scope.lesson.day});
    };

  });
