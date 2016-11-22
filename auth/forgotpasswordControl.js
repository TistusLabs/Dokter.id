'use strict';

angular.module('loginApp.forgot', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/forgot', {
            templateUrl: 'partial-forgot.html',
            controller: 'forgotControl'
        });
    }])

    .controller('forgotControl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

        $scope.processing = false;
        $scope.authenticateUser = function(username, password) {
            $rootScope.ShowBusyContainer("Signing into the system...");
            $scope.processing = true;
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
                $scope.processing = false;
            });
            client.onError(function(data) {
                alert(data.message);
                $scope.processing = false;
            });
            client.AuthenticateUser(username, password);
        };
    }]);