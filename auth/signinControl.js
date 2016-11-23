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

    .controller('signinControl', ['$scope', '$rootScope', '$location', 'User', function ($scope, $rootScope, $location, User) {

        $scope.processing = false;
        $scope.authenticateUser = function (username, password) {
            $rootScope.ShowBusyContainer("Signing into the system...");
            $scope.processing = true;
            var client = User.getClient();
            client.onComplete(function (data) {
                if (data.status) {
                    $scope.$apply(function () {
                        if (data.user.type == "patient") {
                            $location.path("/patient/dashboard");
                            $rootScope.setMenu('patient');
                        } else if (data.user.type == "doctor") {
                            $location.path("/doctor/dashboard");
                            $rootScope.setMenu('doctor');
                        }
                        $rootScope.HideBusyContainer();
                    });
                }
                $scope.processing = false;
            });
            client.onError(function (data) {
                alert(data.message);
                $scope.processing = false;
            });
            client.AuthenticateUser(username, password);
        };

        $scope.navigateURL = function(URL){
            $location.path("join/"+URL);
        };

        $scope.signupUser = function(flag){
            alert("siginup users:"+flag);
        };
    }]);