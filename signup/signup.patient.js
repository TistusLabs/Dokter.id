'use strict';

angular.module('myApp.signup.patient', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/signup/patient', {
            templateUrl: 'signup/signup.patient.html',
            controller: 'signuppatientControl'
        });
    }])

    .controller('signuppatientControl', ['$scope', '$rootScope', function($scope, $rootScope) {
        //$rootScope.checkSession();
    }]);