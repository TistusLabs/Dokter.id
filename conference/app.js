'use strict';

angular.module('conferenceApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'myApp.Services',
    'conferenceApp.call'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/call' });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', '$routeParams', '$route', function ($scope, $rootScope, $location, User, $mdDialog, $routeParams, $route) {

        

        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

        

    }]);
