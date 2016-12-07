'use strict';

angular.module('loginApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'loginApp.signin',
    'loginApp.forgot',
    'myApp.Services'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/signin' });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', function ($scope, $rootScope, $location, User, $mdDialog) {
        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

        $rootScope.displayMessage = function (message,title,ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Okay')
                    .targetEvent(ev)
            );
        };
    }]);
