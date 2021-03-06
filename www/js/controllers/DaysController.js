/**
 * Created by Piotr Kmiecik on 10.10.2017.
 */

angular.module("schedule")
  .controller("DaysController", function ($scope, $rootScope, ScheduleService) {

    /**
     * Init
     */
    setDays();

    /**
     * Init function, set all of days and check which is active (today is this day).
     * Also checks in what hours lessons are in this day.
     */
    function setDays(){
      var today = new Date();
      $scope.days = [
        {id: "monday", active: false, name: $scope.trans("days.monday"), hours_from_to: ScheduleService.all("monday.hours_from_to")},
        {id: "tuesday", active: false, name: $scope.trans("days.tuesday"), hours_from_to: ScheduleService.all("tuesday.hours_from_to")},
        {id: "wednesday", active: false, name: $scope.trans("days.wednesday"), hours_from_to: ScheduleService.all("wednesday.hours_from_to")},
        {id: "thursday", active: false, name: $scope.trans("days.thursday"), hours_from_to: ScheduleService.all("thursday.hours_from_to")},
        {id: "friday", active: false, name: $scope.trans("days.friday"), hours_from_to: ScheduleService.all("friday.hours_from_to")},
        {id: "saturday", active: false, name: $scope.trans("days.saturday"), hours_from_to: ScheduleService.all("saturday.hours_from_to")},
        {id: "sunday", active: false, name: $scope.trans("days.sunday"), hours_from_to: ScheduleService.all("sunday.hours_from_to")}
      ];
      if(!today.getDay()){
        $scope.days[6].active = true;
      } else {
        for(var i in $scope.days){
          if((Number(i)+1) === today.getDay())
            $scope.days[i].active = true;
        }
      }
    }

    /**
     * Init again when reload appears.
     */
    $rootScope.$on("reload_day", function(e, args){
      setDays();
    });

  });
