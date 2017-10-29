/**
 * Created by Piotr Kmiecik on 11.10.2017.
 */
angular.module("schedule")
  .factory("ScheduleService", function($rootScope, NotificationService){

    var LS = localStorage;
    const stdStartHours = ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
    const stdEndHours = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
    var schedule;

    var self = {

      init: function(){
        if(typeof schedule === "undefined") {
          if(!LS.hasOwnProperty("schedule"))
            reset();
          schedule = JSON.parse(LS.getItem("schedule"));
          NotificationService.init(schedule);
        }
      },

      reload: function(){
        schedule = undefined;
        self.init();
      },

      all: function(path, sort){
        var parts = path.split(".");
        var result = find(schedule, 0, parts);
        return sort ? result.sort(function(a, b){
          return Number(a.start) - Number(b.start);
        }) : result;
      },

      get: function(day, id){
        if(typeof day !== "undefined" && schedule.hasOwnProperty(day)){
          for(var i in schedule[day].lessons) {
            if (id === schedule[day].lessons[i].id)
              return schedule[day].lessons[i];
          }
        } else return undefined;
      },

      create: function(lesson){
        if(typeof lesson !== "undefined" && typeof lesson.day !== "undefined" && schedule.hasOwnProperty(lesson.day)){
          lesson.id = schedule[lesson.day].lessons.length;
          schedule[lesson.day].lessons.push(lesson);
          fixHours(lesson.day);
          NotificationService.create(lesson);
          sync();
        }
      },

      update: function(lesson){
        if(typeof lesson !== "undefined" && typeof lesson.day !== "undefined" && schedule.hasOwnProperty(lesson.day)) {
          for (var i in schedule[lesson.day].lessons)
            if (lesson.id === schedule[lesson.day].lessons[i].id) {
              schedule[lesson.day].lessons[i] = lesson;
              fixHours(lesson.day);
              NotificationService.update(lesson);
              sync();
            }
        }
      },

      delete: function(lesson){
        if(typeof lesson !== "undefined" && typeof lesson.day !== "undefined" && schedule.hasOwnProperty(lesson.day)){
          for(var i in schedule[lesson.day].lessons)
            if(lesson.id === schedule[lesson.day].lessons[i].id){
              schedule[lesson.day].lessons.splice(i, 1);
              fixHours(lesson.day);
              NotificationService.delete(lesson);
              sync();
            }
        }
      },

      clear: function(){
        schedule = undefined;
        NotificationService.clear();
        self.init();
        $rootScope.$emit("reload_day");
      }

    };

    function fixHours(day){
      fixStartHours(day);
      fixEndHours(day);
      fixFromToHours(day);
    }

    function fixStartHours(day){
      if(typeof day !== "undefined" && schedule.hasOwnProperty(day)){
        if(schedule[day].lessons.length){
          var newAvailableStartHours = JSON.parse(JSON.stringify(stdStartHours));
          for(var i=0; i<schedule[day].lessons.length; ++i) {
            for(var j=0; j<stdStartHours.length; ++j) {
              if(Number(schedule[day].lessons[i].start) > Number(stdStartHours[j])) continue;
              else {
                if(Number(schedule[day].lessons[i].end) <= Number(stdStartHours[j])) break;
                else newAvailableStartHours.splice(newAvailableStartHours.indexOf(stdStartHours[j]),1);
              }
            }
          }
          schedule[day].availableStartHours = newAvailableStartHours;

        } else {
          schedule[day].availableStartHours = stdStartHours;
        }
      }
    }

    function fixEndHours(day){
      if(typeof day !== "undefined" && schedule.hasOwnProperty(day)){
        if(schedule[day].lessons.length){
          var newAvailableEndHours = JSON.parse(JSON.stringify(stdEndHours));
          for(var i=0; i<schedule[day].lessons.length; ++i){
            for(var j=0; j<stdEndHours.length; ++j) {
              if(Number(schedule[day].lessons[i].start >= Number(stdEndHours[j]))) continue;
              else {
                if(Number(schedule[day].lessons[i].end < Number(stdEndHours[j]))) break;
                else newAvailableEndHours.splice(newAvailableEndHours.indexOf(stdEndHours[j]),1);
              }
            }
          }
          schedule[day].availableEndHours = newAvailableEndHours;

        } else {
          schedule[day].availableEndHours = stdEndHours;
        }
      }
    }

    function fixFromToHours(day){
      if(typeof day !== "undefined" && schedule.hasOwnProperty(day)){
        if(schedule[day].lessons.length){
          var start;
          var end;
          for(var i=0; i<schedule[day].lessons.length; ++i){
            if(typeof start === "undefined" || Number(start) > Number(schedule[day].lessons[i].start))
              start = schedule[day].lessons[i].start;
            if(typeof end === "undefined" || Number(end) < Number(schedule[day].lessons[i].end))
              end = schedule[day].lessons[i].end;
          }
          schedule[day].hours_from_to = start + ":00 - " + end + ":00";
        } else {
          schedule[day].hours_from_to = undefined;
        }
      }
    }

    function find(parent, index, parts){
      if(parent.hasOwnProperty(parts[index])){
        var el = parent[parts[index]];
        if(typeof el !== "undefined"){
          if(parts.length === (index+1))
            return el;
          else
            return find(el, ++index, parts);
        }
      }
    }

    function reset(){
      LS.setItem("schedule", JSON.stringify({
        monday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        tuesday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        wednesday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        thursday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        friday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        saturday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours},
        sunday: {lessons: [], availableStartHours: stdStartHours, availableEndHours: stdEndHours}
      }));
    }

    function sync(){
      LS.removeItem("schedule");
      LS.setItem("schedule", JSON.stringify(schedule));
    }

    return self;

  });
