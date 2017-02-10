'use strict';

angular.module('myApp.consultation', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/doctor/consultations', {
            templateUrl: 'consultation/consultation.html',
            controller: 'consultationControl'
        });
    }])

    .controller('consultationControl', ['$scope', '$rootScope', '$routeParams', 'User', '$location','$http','AppURLs', function ($scope, $rootScope, $routeParams, User, $location,$http,AppURLs) {
        //$rootScope.checkSession();
       
        
        

    }]);