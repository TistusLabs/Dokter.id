'use strict';

angular.module('myApp.myprofile.doctor', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/doctor/profile', {
            templateUrl: 'myprofile/doctor/myprofile.html',
            controller: 'profileControll'
        });
    }])

    .controller('profileControll', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

    }]);