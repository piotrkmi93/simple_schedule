/**
 * Created by Piotr Kmiecik on 21.10.2017.
 */

angular.module("schedule")
  .factory("NotificationService", function($rootScope, $q, trans){

    var LS = localStorage;
    var closerDates;
    var schedule;
    var sync;

    var self = {

      init: function(s, sy){
        schedule = s;
        sync = sy;
      },

      create: function(lesson, updating){
        if($rootScope.isApp && $rootScope.notification_delay !== "off" && valid(lesson)) {
          prepareCloserDates();
          var id = Number(LS.getItem("last_notification_id"));
          var date = new Date(
            closerDates[lesson.day].getFullYear(),
            closerDates[lesson.day].getMonth(),
            closerDates[lesson.day].getDate(),
            Number(lesson.start) - 1,
            60 - Number($rootScope.notification_delay)
          );
          cordova.plugins.notification.local.schedule({
            id: id,
            title: title(lesson.type, $rootScope.notification_delay),
            text: text(lesson),
            firstAt: date,
            every: "week"
          });
          lesson.notification_id = id;
          LS.setItem("last_notification_id", id+1);
          if(updating)
            sync();
          // alert("NOTIFICATION CREATED " + id);
        }
      },

      update: function(lesson){
        self.delete(lesson, true);
      },

      updateAll: function(){
        for(var day in schedule) {
          for (var lesson in schedule[day].lessons) {
            self.update(schedule[day].lessons[lesson]);
          }
        }

      },

      delete: function(lesson, updating){
        if($rootScope.isApp && valid(lesson)) {
          if(typeof lesson.notification_id !== "undefined") {
            cordova.plugins.notification.local.isScheduled(lesson.notification_id, function (isScheduled) {
              var t = JSON.stringify(lesson.notification_id);
              if (isScheduled) {
                cordova.plugins.notification.local.cancel(lesson.notification_id, function () {
                  // alert("NOTIFICATION CANCELED for " + t);
                  if (updating) {
                    self.create(lesson, updating);
                  }
                });
              } else {
                if (updating)
                  self.create(lesson, updating);
              }
            });
          } else {
            if (updating)
              self.create(lesson, updating);
          }
        }
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
        var tmp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
        switch(tmp.getDay()){
          case 0: closerDates.sunday = tmp; break;
          case 1: closerDates.monday = tmp; break;
          case 2: closerDates.tuesday = tmp; break;
          case 3: closerDates.wednesday = tmp; break;
          case 4: closerDates.thursday = tmp; break;
          case 5: closerDates.friday = tmp; break;
          case 6: closerDates.saturday = tmp; break;
        }
      }
    }

    function text(lesson){
      return trans("notifications.text", {
        name: lesson.name,
        room: lesson.room,
        leader: lesson.leader
      });
    }

    function title(type, time){
      return trans("notifications.title", {type: trans("lesson.types."+type), time: time});
    }

    function valid(lesson){
      return typeof lesson !== "undefined" && typeof lesson.id !== "undefined" && typeof lesson.day !== "undefined";
    }

  });
