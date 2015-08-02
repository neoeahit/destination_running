'use strict';

var activityModule = angular.module('routerApp', ['ngSanitize','ui.select','ui.router']);

activityModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html'
        })

        .state('customize', {
            url: '/customize',
            templateUrl: 'partials/customize.html'

        })

        .state('places', {
            url: '/places',
            templateUrl: 'partials/places.html'

        })

        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html'
        });


});

activityModule.controller('DemoCtrl', function($scope, $http, $timeout) {

    $scope.countries = [
        {name: 'Lucknow', country:'India', lat: 26.85, long:80.91 },
        {name: 'Agra', country:'India', lat: 23.93, long:77.55 },
        {name: 'Jaipur', country:'India', lat: 24.9, long:93.066 },
    ];
    $scope.selected = {};
    $scope.selected.cities = [];
    $scope.selected.cities = [];

    $scope.submitInfo = function(){
        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng($scope.selected.cities[0].lat,$scope.selected.cities[0].long),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        $scope.markers = [];
        for (var i = 0; i <  $scope.selected.cities.length; i++){
            createMarker($scope.selected.cities[i]);
        }
    }

    $scope.results = []

    $http.get('/api/lat/4/long/2').
        then(function(response) {
            $scope.results = response.data.results
            console.log($scope.results)
        }, function(response) {
            console.log(response)

        });


    var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.name
        });
        $scope.markers.push(marker);
    }

});


