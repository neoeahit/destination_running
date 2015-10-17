'use strict';

var activityModule = angular.module('routerApp', ['angular-svg-round-progress', 'ui.bootstrap','ngRoute', 'ui.select', 'ui.router']);
activityModule.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            data: {
                requireLogin: false
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            data: {
                requireLogin: false
            }
        })
        .state('reviews', {
            url: '/reviews',
            templateUrl: 'partials/reviews.html',
            controller: 'DemoCtrl',
            data: {
                requireLogin: true
            }
        })
        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html',
            controller: 'placesCtrl',
            data: {
                requireLogin: false
            }

        })


});

activityModule.run(function ($rootScope, $state, LoginService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        console.log($rootScope.currentUser)
        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();

            LoginService()
                .then(function () {
                    return $state.go(toState.name, toParams);
                })
                .catch(function () {
                    return $state.go('home');
                });
        }
    });

});


