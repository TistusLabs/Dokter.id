'use strict';

angular.module('myApp.signup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/signup/', {
            templateUrl: 'signup/signup.html',
            controller: 'signupControl'
        });
    }])

    .controller('signupControl', ['$scope','$rootScope', function($scope,$rootScope) {
        //$rootScope.checkSession();
    }]);