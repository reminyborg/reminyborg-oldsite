'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    factory('GeoDistance',function() {
        var toRad = function(num) {
            return num * Math.PI / 180
        }

        return function distance(start, end) {
            var R = 6371;

            var dLat = toRad(end.latitude - start.latitude)
            var dLon = toRad(end.longitude - start.longitude)
            var lat1 = toRad(start.latitude)
            var lat2 = toRad(end.latitude)

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

            return R * c
        }
    }).
    value('version', '0.1').
    factory('GeoService', ['$rootScope', function ($rootScope) {
        var disabled = true;

        var geo = {
            lastPosition: {},
            watching: false,
            watchID: null,

            isDisabled: function () {
                return disabled;
            },

            setDisabled: function(set) {
                disabled = set;
            },

            locationBroadcast: function (position) {
                var pos = {time: new Date().getTime(), coords: position.coords};

                $rootScope.$broadcast("locationBroadcast", pos);
                $rootScope.$apply();
            },

            start: function () {
                if (!this.watching) {
                    this.watchID = navigator.geolocation.watchPosition(this.locationBroadcast);
                    this.watching = true;
                }
            },

            stop: function () {
                if (this.watching) {
                    navigator.geolocation.clearWatch(this.watchID);
                    this.watching = false;
                }
            }
        };

        $rootScope.$on('locationBroadcast', function (event, position) {
            if(disabled)
                geo.setDisabled(false);

            angular.copy(position, geo.lastPosition);
        });

        geo.start();

        return geo;
    }]).
    factory('TripService', [ '$rootScope', 'GeoService', 'localStorageService', 'GeoDistance',
        function ($rootScope, GeoService, localStorageService, GeoDistance) {
        //TODO: Redesign with this in mind https://github.com/vojtajina/WebApp-CodeLab/blob/angularjs/FinalProject/js/services.js#L62;
        var recording = false;

        var trips = {
            all: angular.fromJson(localStorageService.get('storedTrips')),
            filtered: [],
            selected: { geoJson: null, time: 0, distance: 0, avgSpeed: 0},
            current: { geoJson: null, time: 0, distance: 0, avgSpeed: 0},
            lastRecordedPosition: {},

            isRecording: function() {
                return recording;
            },

            updateDistance: function(position) {
                this.current.distance += GeoDistance(this.lastRecordedPosition.coords,position.coords)
            },

            updateMetadata: function() {
                this.current.time = new Date().getTime() - this.current.startTime;
                if(this.current.time > 0)
                    this.current.avgSpeed = this.current.distance / (this.current.time / 3600000);
            },

            startTrip: function () {
                angular.copy({
                    startTime: new Date().getTime(),
                    time: 0,
                    distance: 0,
                    avgSpeed: 0,
                    geoJson: {
                        "type": "FeatureCollection",
                        "features": [
                            { "type": "Feature",
                                "geometry": {"type": "Point", "coordinates": [ GeoService.lastPosition.coords.longitude, GeoService.lastPosition.coords.latitude ]},
                                "properties": {"name": "start"}
                            },
                            { "type": "Feature",
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [
                                        [ GeoService.lastPosition.coords.longitude, GeoService.lastPosition.coords.latitude ]
                                    ]
                                },
                                "properties": {"name": "path"}
                            }
                        ]
                    }
                },this.current);
                angular.copy(this.current,this.selected);
                this.lastRecordedPosition = angular.copy(GeoService.lastPosition);
                recording = true;
                this.updateMetadata();
            },

            endTrip: function () {
                if (recording) {
                    this.current.endTime = new Date().getTime();
                    this.current.geoJson.features[2] = {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [ GeoService.lastPosition.coords.longitude, GeoService.lastPosition.coords.latitude ]},
                        "properties": {"name": "end"}
                    };
                    this.updateDistance(GeoService.lastPosition);
                    this.updateMetadata();
                    this.lastRecordedPosition = angular.copy(GeoService.lastPosition);
                    this.all.push(angular.copy(this.current));
                    angular.copy(this.current,this.selected);
                    localStorageService.add('storedTrips',angular.toJson(this.all));
                }
                recording = false;
            },

            removeTrips: function() {
                this.all = [];
                this.selected = { geoJson: null };
            }
        };

        $rootScope.$on('locationBroadcast', function (event, position) {
            if(recording) {
                var path = trips.current.geoJson.features[1];
                path.geometry.coordinates.push([ position.coords.longitude, position.coords.latitude ]);
                trips.updateDistance(position);
                trips.updateMetadata();
                trips.lastRecordedPosition = angular.copy(position);
                angular.copy(trips.current,trips.selected);
            }
        });

        if(!trips.all) {
            trips.all = [];
        }

        return trips;
    }]);
