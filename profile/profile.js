'use strict';

angular.module('myApp.profile', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.html',
            controller: 'profileControll'
        });
    }])

    .controller('profileControll', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

    }]);