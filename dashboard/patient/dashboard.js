'use strict';

angular.module('myApp.patient.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/dashboard', {
            templateUrl: 'dashboard/patient/dashboard.html',
            controller: 'dashboardControll'
        });
    }])

    .controller('dashboardControll', ['$scope', '$rootScope', '$location', 'User','AppURLs', function ($scope, $rootScope, $location, User,AppURLs) {
        $rootScope.checkSession();
        $scope.setUserOnline = function(username){
            angular.forEach($scope.doctors, function (doctor, index) {
                if(doctor.username == username){
                    $scope.$apply(function(){
                        doctor.status = "Online";
                    });
                }
            });
        }
        var socket = io.connect(AppURLs.socketServer);
        socket.on('useronline', function (username) {
            //make a service call and update the user on DB
            $scope.setUserOnline(username);
        });

        var client = User.getClient();
        client.onComplete(function (data) {
            $scope.doctors = data;
        });
        client.onError(function (data) {
            alert(data.message);
        });
        client.GetAllDoctors();


        $scope.openDoctorDetails = function (doctorid) {
            $location.path("/patient/dashboard/doctor/" + doctorid);
        };
        
        $scope.scheduleCall = function(){
            alert("Scheduleing call");
        }

        $scope.redirect = function (c) {
            $rootScope.setChatDataConnection(c);
            $scope.$apply(function () {
                console.log("Redirecting page for '"+c.label +"' request...");
                $rootScope.connectionStatus = "Connecting...";
                $location.path("/chat/" + c.metadata + "/to");
            });
        }

        var peer = $rootScope.getPeer();
        peer.on('connection', function (c) {
            c.on('open', function () {
                console.log(c.label +" request is recived.");
                if(c.label == "chat"){
                    $rootScope.setPeer(peer);
                    $scope.redirect(c);
                }
            });
        });
        peer.on('error', function (err) {
            alert(err);
        })

    }]);