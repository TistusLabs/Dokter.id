'use strict';

angular.module('myApp.mypatients', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/doctor/patients', {
            templateUrl: 'mypatients/mypatients.html',
            controller: 'mypatientsControll'
        });
    }])

    .controller('mypatientsControll', ['$scope', '$rootScope', function ($scope, $rootScope) {;
        $rootScope.checkSession();
        
        
    }]);