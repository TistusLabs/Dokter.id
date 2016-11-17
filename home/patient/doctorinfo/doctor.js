'use strict';

angular.module('myApp.home.doctorinfo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/home/doctor/:doctorID', {
            templateUrl: 'home/patient/doctorinfo/doctor.html',
            controller: 'doctorControl'
        });
    }])

    .controller('doctorControl', ['$scope', '$rootScope', '$routeParams', 'User', '$location', function ($scope, $rootScope, $routeParams, User, $location) {
        //$rootScope.checkSession();
        console.log("Recieved id:", $routeParams.doctorID);

        var client = User.getClient();
        client.onComplete(function (data) {
            var passhash = CryptoJS.MD5(data.object.username);
            data.object.profileimage = "http://www.gravatar.com/avatar/" + passhash;
            $scope.doctor = data.object;
        });
        client.GetUserID($routeParams.doctorID);

        $scope.openChatWindow = function (doctor) {
            // get from cache and set partnerPeer ID
            //$rootScope.setPartnerPeerID(c.peer);
            $rootScope.connectionStatus = "Connecting...";
            $location.path("/chat/" + doctor.id + "/from");
        };

        $scope.backtoDashboard = function () {
            $location.path("/patient/dashboard/");
        };

        $scope.arrayToString = function (string) {
            return string.join(", ");
        };

        $scope.tabs = {}
         $scope.tabs.overview = true;
                    $scope.tabs.message = false;
                    $scope.tabs.consultationhistory = false;
                    
        $scope.changeTab = function(tabID){
            switch (tabID) {
                case "tabOverview":{
                    $scope.tabs.overview = true;
                    $scope.tabs.message = false;
                    $scope.tabs.consultationhistory = false;
                    break;
                }
                case "tabMessage":{
                    $scope.tabs.overview = false;
                    $scope.tabs.message = true;
                    $scope.tabs.consultationhistory = false;
                    break;
                }
                case "tabConsultationHistory":{
                    $scope.tabs.overview = false;
                    $scope.tabs.message = false;
                    $scope.tabs.consultationhistory = true;
                    break;
                }
            }
        }

    }]);