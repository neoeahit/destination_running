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
            templateUrl: 'partials/places.html',
            controller: 'placesCtrl'

        })

        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html'
        });


});
