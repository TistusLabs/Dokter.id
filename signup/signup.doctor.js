'use strict';

angular.module('myApp.signup.doctor', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/signup/doctor', {
            templateUrl: 'signup/signup.doctor.html',
            controller: 'signupdoctorControl'
        });
    }])

    .controller('signupdoctorControl', ['$scope','$rootScope', function($scope,$rootScope) {
        //$rootScope.checkSession();
    }]);