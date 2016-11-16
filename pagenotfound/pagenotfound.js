'use strict';

angular.module('myApp.pagenotfound', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pagenotfound', {
            templateUrl: 'pagenotfound/pagenotfound.html',
            controller: 'pagenotfoundControll'
        });
    }])

    .controller('pagenotfoundControll', ['$scope', '$rootScope', function ($scope, $rootScope) {
        
    }]);