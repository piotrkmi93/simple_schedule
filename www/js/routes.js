/**
 * Created by Piotr Kmiecik on 10.10.2017.
 */
angular.module("schedule")
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider

      .state("days", {
        url: "/",
        templateUrl: "views/days.html",
        controller: "DaysController"
      })

      .state("config", {
        url: "/config",
        templateUrl: "views/config.html",
        controller: "ConfigController"
      })

      .state("day", {
        url: "/days/:day",
        templateUrl: "views/day.html",
        controller: "SingleDayController"
      })

      .state("lesson", {
        url: "/days/:day/lesson/:id",
        templateUrl: "views/lesson.html",
        controller: "LessonController"
      });

  });
