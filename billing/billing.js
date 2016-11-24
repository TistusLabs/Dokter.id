'use strict';

angular.module('myApp.billing', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/billing', {
            templateUrl: 'billing/billing.html',
            controller: 'billingControl'
        });
    }])

    .controller('billingControl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {

    }]);