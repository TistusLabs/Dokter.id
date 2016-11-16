'use strict';

angular.module('loginApp.signin', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/signin', {
            templateUrl: 'partial-signin.html',
            controller: 'signinControl'
        });
    }])

    .controller('signinControl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

        $scope.authenticateUser = function(username, password) {
            $rootScope.ShowBusyContainer("Signing into the system...");
            var client = User.getClient();
            client.onComplete(function(data) {
                if (data.status) {
                    $scope.$apply(function() {
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
            });
            client.onError(function(data) {
                alert(data.message);
            });
            client.AuthenticateUser(username, password);
        };
    }]);