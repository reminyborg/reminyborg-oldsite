'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('HeaderController', ['$scope', 'GeoService', 'TripService', function ($scope, GeoService, TripService) {
        $scope.isDisabled = GeoService.isDisabled;
        $scope.isRecording = TripService.isRecording;
        $scope.currentTrip = TripService.selected;


        $scope.toggleRecording = function () {
            if($scope.isRecording()) {
                TripService.endTrip();
            } else {
                TripService.startTrip();
            }

        }
    }]).
    controller('MapController', ['$scope', 'GeoService', 'TripService', '$rootScope', function ($scope, GeoService, TripService, $rootScope) {
        $scope.debug = false;
        $scope.selectedTrip = TripService.selected;
        $scope.isRecordingTrip = TripService.isRecording;
        $scope.lastPosition = GeoService.lastPosition;

        //Test to add other types of markers
        var local_icons = {
            currentPosition: L.divIcon({className: 'icon-current-position'})
        };
        $scope.icons = local_icons;

        $scope.defaults = {
            tileLayer: "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
            maxZoom: 16
        };


        if(typeof $scope.lastPosition.coords != 'undefined')
        {
            $scope.lastPositionMarker = {
                lat: $scope.lastPosition.coords.latitude,
                lng: $scope.lastPosition.coords.longitude,
                draggable: false,
                icon: local_icons.currentPosition
            };

            $scope.center = {
                lat: $scope.lastPosition.coords.latitude,
                lng: $scope.lastPosition.coords.longitude,
                zoom: 14
            };
        }
        else
        {
            $scope.lastPositionMarker = {
                lat: 0,
                lng: 0,
                draggable: false,
                icon: local_icons.currentPosition
            };

            $scope.center = {
                lat: 59.177951,
                lng: 10.221754,
                zoom: 14
            };
        };

        if($scope.debug) {
            $scope.$on('leafletDirectiveMap.click', function(event, args){
                var coords = {
                        latitude: args.leafletEvent.latlng.lat,
                        longitude: args.leafletEvent.latlng.lng
                };
                var pos = {time: new Date(), coords: coords}

                $rootScope.$broadcast("locationBroadcast", pos);
            });
        };

        $scope.$watch('lastPosition', function (newVal) {
            if(!angular.isUndefined(newVal.coords)) {
                angular.copy({
                    lat: $scope.lastPosition.coords.latitude,
                    lng: $scope.lastPosition.coords.longitude,
                    draggable: false,
                    icon: local_icons.currentPosition
                },$scope.lastPositionMarker);

                if($scope.isRecordingTrip()){
                    $scope.center.lat =  $scope.lastPosition.coords.latitude;
                    $scope.center.lng =  $scope.lastPosition.coords.longitude;
                }
            }
        },true);

        $scope.$watch('selectedTrip', function (newVal) {
            if(!angular.isUndefined(newVal)) {
                $scope.geoJson = {
                 data: $scope.selectedTrip.geoJson,
                    style: {
                        weight: 3,
                        color: 'blue'
                        //fillOpacity: 0.7
                    },
                    draggable: false,
                    autoFit: !$scope.isRecordingTrip()
                };
            }
        },true);

        $scope.geoJson = {};
    }]).
    controller('ListController', ['$scope', '$location', 'TripService', function ($scope, $location,TripService) {
        $scope.trips = TripService.all;
        $scope.selectTrip = function (selectedTrip) {
            angular.copy(selectedTrip,TripService.selected);
            $location.path('/map');
        };

        $scope.gridOptions = {
            data: 'trips',
            multiSelect: false,
            columnDefs: [
                {field:'startTime', displayName: 'Start Time', cellFilter:'date:\'MMM d, H:mm\''},
                {field:'endTime', displayName:'End Time', cellFilter:'date:\'MMM d, H:mm\''},
                {field:'time', displayName:'Time', cellFilter:'hourtime'},
                {field:'distance', displayName:'Distance', cellFilter:'distance'}
            ],
            sortInfo: { fields: ['startTime'], directions: ['desc']},
            afterSelectionChange: function(data) {
                $scope.selectTrip(data.entity);
                return true;
            }

        };
    }]).
    controller('MenuController', ['$scope', 'TripService','localStorageService', function ($scope, TripService, localStorageService) {
        $scope.trips = TripService;
        $scope.resetLocalStorage = function () { localStorageService.clearAll() };
    }]);