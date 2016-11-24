'use strict';

angular.module('myApp.topup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/topup', {
            templateUrl: 'topup/topup.html',
            controller: 'topupControl'
        });
    }])

    .controller('topupControl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

    }]);