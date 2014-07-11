'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp',  ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers',
        'leaflet-directive', 'ngGrid', 'LocalStorageModule']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapController'});
    $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListController'});
    $routeProvider.otherwise({redirectTo: '/map'});
  }]);