'use strict';

var activityModule = angular.module('routerApp', ['angular-svg-round-progress','ngRoute','ui.select','ui.router']);

activityModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html'
        })

        .state('reviews', {
            url: '/reviews',
            templateUrl: 'partials/reviews.html',
            controller: 'DemoCtrl'

        })

        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html',
            controller: 'placesCtrl'

        })

        .state('addblog', {
            url: '/addblog',
            templateUrl: 'partials/addblogs.html'
        })
        .state('race', {
            url: '/stories/:id',
            templateUrl: 'partials/specificRace.html',
            controller: 'race'
        });


});
