'use strict';

angular.module('loginApp.signin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/signin', {
            templateUrl: 'partial-signin.html',
            controller: 'signinControl'
        }).when('/join', {
            templateUrl: 'partial-join.html',
            controller: 'signinControl'
        }).when('/join/patient', {
            templateUrl: 'partial-join-patient.html',
            controller: 'signinControl'
        }).when('/join/doctor', {
            templateUrl: 'partial-join-doctor.html',
            controller: 'signinControl'
        }).when('/done', {
            templateUrl: 'partial-done.html',
            controller: 'signinControl'
        });
    }])

    .controller('signinControl', ['$scope', '$rootScope', '$location', 'User', '$window', function ($scope, $rootScope, $location, User, $window) {

        $scope.processing = false;
        $scope.authenticateUser = function (username, password) {
            $rootScope.ShowBusyContainer("Signing into the system...");
            $scope.processing = true;
            var client = User.getClient();
            client.onComplete(function (data) {
                if (data.status) {
                    $window.location.href = "../";
                    $rootScope.HideBusyContainer();
                }
                $scope.processing = false;
            });
            client.onError(function (data) {
                alert(data.message);
                $scope.processing = false;
            });
            client.AuthenticateUser(username, password);
        };

        $scope.navigateURL = function (URL) {
            $location.path("join/" + URL);
        };

        $scope.signupUser = function (flag,event) {
            $scope.processing = true;
            $rootScope.ShowBusyContainer("Signing you up with the system...");

            var profile = {
                "name":$scope.name,
                "username":$scope.username,
                "password":$scope.password,
                "type":flag
            }

            var client = User.getClient();
            client.onComplete(function (data) {
                $scope.processing = false;
                $rootScope.displayMessage("Your have been successfully registered","Success!",event);
            });
            client.onError(function (data) {
                $rootScope.displayMessage("Ops. There was an issue","Success!",event);
                $scope.processing = false;
            });
            client.RegisterUser(profile);
        };
    }]);