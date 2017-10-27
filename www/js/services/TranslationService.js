/**
 * Created by Piotr Kmiecik on 10.10.2017.
 */
angular.module("schedule")
  .service("trans", function($rootScope){

    var translations;

    switch($rootScope.locale) {

      case "pl":
        translations = {
          navigation: {
            days: "Dni tygodnia",
            config: "Ustawienia",
            new_lesson: "Nowe zajęcie",
            edit_lesson: "Edycja zajęcia"
          },
          days: {
            monday: "Poniedziałek",
            tuesday: "Wtorek",
            wednesday: "Środa",
            thursday: "Czwartek",
            friday: "Piątek",
            saturday: "Sobota",
            sunday: "Niedziela"
          },
          messages: {
            no_activities: "Brak zajęć"
          },
          lesson: {
            name: "Nazwa",
            type: "Typ",
            room: "Sala",
            leader: "Prowadzący",
            institute: "Instytut",
            start: "Rozpoczęcie",
            end: "Zakończenie",
            types: {
              lecture: "Wykład",
              laboratories: "Laboratoria",
              exercises: "Ćwiczenia"
            },
            deleteButton: {
              message: "Czy na pewno chcesz usunąć \"{name}\"?",
              cancel: "Anuluj",
              confirm: "Usuń"
            }
          },
          config: {
            labels: {
              locale: "Język",
              notifications: "Powiadomienia",
              minutes_before: "{n} minut przed",
              off: "Wyłączone",
              clear: "Wyczyść dane"
            },
            locales: {
              pl: "Polski",
              en: "Angielski"
            },
            deleteButton: {
              message: "Czy na pewno chcesz usunąć wszystkie zapisane zajęcia?",
              sub_message: "Nie będziesz miał możliwości przywrócenia danych.",
              cancel: "Anuluj",
              confirm: "Wyczyść"
            }
          },
          notifications: {
            message: "" // todo
          }
        };
        break;

      // more locales available here

      default:
        translations = {
          navigation: {
            days: "Days of week",
            config: "Config",
            new_lesson: "New lesson",
            edit_lesson: "Edit lesson"
          },
          days: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
          },
          messages: {
            no_activities: "No activities"
          },
          lesson: {
            name: "Name",
            type: "Type",
            room: "Room",
            leader: "Leader",
            institute: "Institute",
            start: "Start",
            end: "End",
            types: {
              lecture: "Lecture",
              laboratories: "Laboratories",
              exercises: "Exercises"
            },
            deleteButton: {
              message: "Do you really want to delete \"{name}\"?",
              cancel: "Cancel",
              confirm: "Delete"
            }
          },
          config: {
            labels: {
              locale: "Language",
              notifications: "Notifications",
              minutes_before: "{n} minutes before",
              off: "Disabled",
              clear: "Clear data"
            },
            locales: {
              pl: "Polish",
              en: "English"
            },
            deleteButton: {
              message: "Are you sure you want to delete all saved activities?",
              sub_message: "You will not be able to restore data.",
              cancel: "Cancel",
              confirm: "Clear"
            }
          }
        };
    }

    /**
     * This service works as a function,
     * it's returning translated string searched by path.
     *
     * @update
     * New parameter variables contains object with names for replace.
     * To achieve this, function builds custom RegExp.
     */
    return function(path, variables){
      var parts = path.split(".");
      var result = find(translations, 0, parts);
      if(typeof result !== "undefined" && typeof variables !== "undefined")
        for(var key in variables) {
          var regex = new RegExp("{"+key+"}", "g");
          result = result.replace(regex, variables[key]);
        }
      return result || "not_found:" + path;
    };

    /**
     * Finding translated string recursively,
     * if not found return undefined
     * @param parent
     * @param index
     * @param parts
     * @returns {*}
     */
    function find(parent, index, parts){
      if(parent.hasOwnProperty(parts[index])){
        var el = parent[parts[index]];
        if(typeof el === "string" || (typeof el === "object" && parts.length === (index+1)))
          return el;
        else
          return find(el, ++index, parts);
      }
    }

  });
