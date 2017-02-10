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

        $scope.isloading = true;
       
        var client = User.getClient();
        client.onComplete(function (data) {
            angular.forEach(data, function (patient) {
                var passhash = CryptoJS.MD5(patient.patient);
                patient.profileimage = "http://www.gravatar.com/avatar/" + passhash;

                patient.startdatetime = new Date(patient.startdatetime);
                patient.enddatetime = new Date(patient.enddatetime);
            });
            $scope.myConsultations = data;
            $scope.isloading = false;
        });
        client.onError(function (data) {
            console.log("There was an error loading the consultations");
        });
        client.GetAllMyConsultations($rootScope.userObject.username);
        

    }]);