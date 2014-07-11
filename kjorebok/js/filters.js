'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).
    filter('hourtime', function() {
        return function(time, addSeconds) {
            var sec_num = Math.floor(time / 1000);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}

            var time    = hours+':'+minutes;

            if(addSeconds) {
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                if (seconds < 10) {seconds = "0"+seconds;}
                time += ':'+seconds;
            }
            return time;
        }
    }).
    filter('distance', ['$filter', function($filter) {
        return function(distance) {
            return $filter('number')(distance,2) + ' km';
        }
    }])
    ;
