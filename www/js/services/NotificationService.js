/**
 * Created by Piotr Kmiecik on 21.10.2017.
 */

angular.module("schedule")
  .factory("NotificationService", function($rootScope, trans){

    // $cordovaLocalNotification

    var LS = localStorage;
    var notifications;
    var closerDates;
    var schedule;

    var self = {

      init: function(s){
        schedule = s;
      },

      create: function(lesson){
        if(valid(lesson)) {
          closerDates = prepareCloserDates();
          cordova.plugins.notification.local.schedule({
            id: id(lesson),
            text: text(lesson),
            firstAt: new Date(
              closerDates[day].getFullYear(),
              closerDates[day].getMonth(),
              closerDates[day].getDate(),
              Number(lesson.start) - 1,
              60 - Number($rootScope.notification_delay)
            ),
            every: "week"
          });
        }
      },

      update: function(lesson){
        self.delete(lesson);
        self.create(lesson);
      },

      updateAll: function(){
        for(var day in schedule)
          for(var lesson in schedule[day].lessons){
            self.delete(schedule[day].lessons[lesson]);
            self.create(schedule[day].lessons[lesson]);
          }
      },

      delete: function(lesson){
        if(valid(lesson))
          cordova.plugins.notification.local.cancel(id(lesson));
      },

      clear: function(){
        for(var day in schedule)
          for(var lesson in schedule[day].lessons)
            self.delete(schedule[day].lessons[lesson]);
      }

    };

    return self;

    function prepareCloserDates(){
      closerDates = {};
      var now = new Date();
      for(var i=0; i<7; ++i){
        var tmp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i)
        switch(tmp.getDay()){
          case 1: closerDates.monday = tmp; break;
          case 2: closerDates.tuesday = tmp; break;
          case 3: closerDates.wednesday = tmp; break;
          case 4: closerDates.thursday = tmp; break;
          case 5: closerDates.friday = tmp; break;
          case 6: closerDates.saturday = tmp; break;
          case 7: closerDates.sunday = tmp; break;
        }
      }
      console.log(closerDates);
    }

    function id(lesson){
      return lesson.day + String(lesson.id);
    }

    function text(lesson){

    }

    function valid(lesson){
      return typeof lesson !== "undefined" && typeof lesson.id !== "undefined" && typeof lesson.day !== "undefined";
    }

  });
