'use strict';

angular.module('myApp.consultation', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/consultations', {
            templateUrl: 'consultation/consultation.html',
            controller: 'consultationControl'
        });
    }])

    .controller('consultationControl', ['$scope', '$rootScope', '$routeParams', 'User', '$location', '$http', 'AppURLs', function ($scope, $rootScope, $routeParams, User, $location, $http, AppURLs) {
        //$rootScope.checkSession();
        $scope.currentuser = $rootScope.userObject;
        $scope.isloading = true;

        var client = User.getClient();
        client.onComplete(function (data) {
            angular.forEach(data, function (patient) {
                var passhash = ""
                if ($scope.currentuser.type == "doctor") {
                    passhash = CryptoJS.MD5(patient.patient);
                } else if ($scope.currentuser.type == "patient") {
                    passhash = CryptoJS.MD5(patient.doctor);
                }
                patient.profileimage = "http://www.gravatar.com/avatar/" + passhash;

                patient.startdatetime = new Date(patient.startdatetime);
                patient.enddatetime = new Date(patient.enddatetime);

                var duration = patient.enddatetime - patient.startdatetime;
                var duration = new Date(duration);
                var seconds = duration.getUTCSeconds();
                var minutes = duration.getUTCMinutes();
                var hours = duration.getUTCHours();

                patient.duration = minutes +" : "+seconds;

            });
            $scope.myConsultations = data;
            $scope.isloading = false;
        });
        client.onError(function (data) {
            console.log("There was an error loading the consultations");
        });
        if ($rootScope.userObject.type == "doctor") {
            client.GetAllMyConsultations($rootScope.userObject.username);
        } else if ($rootScope.userObject.type == "patient") {
            client.GetAllPatientConsultations($rootScope.userObject.username);
        }

    }]);