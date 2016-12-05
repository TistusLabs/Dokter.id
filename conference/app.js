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

        $rootScope.isNullOrEmptyOrUndefined = function (value) {
            return !value;
        };
        var client = User.getAuthClient();
        var securityToken = client.checkSession();
        var session = client.getSession();
        
        if ($rootScope.isNullOrEmptyOrUndefined(session.profileimage)) {
            var passhash = CryptoJS.MD5(session.username);
            session.profileimage = "https://www.gravatar.com/avatar/" + passhash;
        }
        $rootScope.userObject = session;

        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };



    }]);
