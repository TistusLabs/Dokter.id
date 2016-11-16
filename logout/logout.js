'use strict';

angular.module('myApp.logout', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'logout/logout.html',
            controller: 'logoutControll'
        });
    }])

    .controller('logoutControll', ['$scope', '$rootScope', function ($scope, $rootScope) {

        $rootScope.username = null;
        $rootScope.checkSession();
    }]);