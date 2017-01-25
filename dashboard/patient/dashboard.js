'use strict';

angular.module('myApp.patient.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/dashboard', {
            templateUrl: 'dashboard/patient/dashboard.html',
            controller: 'dashboardControll'
        });
    }])

    .controller('dashboardControll', ['$scope', '$rootScope', '$location', 'User', 'AppURLs', function ($scope, $rootScope, $location, User, AppURLs) {
        /*$rootScope.checkSession();
        */
        $scope.setUserOnline = function (username) {
            angular.forEach($scope.doctors, function (doctor, index) {
                if (doctor.username == username) {
                    $scope.$apply(function () {
                        doctor.status = "available";
                    });
                }
            });
        }

        $scope.setUserStatuses = function (data) {
            angular.forEach(data, function (status, index) {
                angular.forEach($scope.doctors, function (doctor, index) {
                    if (doctor.username == status.username) {
                        $scope.$apply(function () {
                            doctor.status = status.status;
                        });
                    }
                });
            });
        }

        var socket = io.connect(AppURLs.socketServer);
        socket.on('useronline', function (username) {
            //make a fd service call and update the user on DB
            debugger
            $scope.setUserOnline(username);
        });

        socket.on('statuschanged', function (data) {
            //make a fd service call and update the user on DB
            debugger
            $scope.setUserStatuses(data);
        });

        $scope.isLoading = true;

        var client = User.getClient();
        client.onComplete(function (data) {
            angular.forEach(data, function (doc) {
                var passhash = CryptoJS.MD5(doc.username);
                doc.profileimage = "http://www.gravatar.com/avatar/" + passhash;
            });
            var doctors = data;
            $http.get(AppURLs.connectionStorage + '/status/getall').
                success(function (data, status, headers, config) {

                    angular.forEach(data, function (status, index) {
                        angular.forEach(doctors, function (doctor, index) {
                            if (doctor.username == status.username) {
                                $scope.$apply(function () {
                                    doctor.status = status.status;
                                });
                            }
                        });
                    });
                    $scope.doctors = doctors;
                    $scope.isLoading = false;
                }).
                error(function (data, status, headers, config) {
                    console.log("Oops error");
                });
        });
        client.onError(function (data) {
            alert(data.message);
            $scope.isLoading = false;
        });
        client.GetAllDoctors();

        $scope.scheduleCall = function () {
            alert("Scheduleing call");
        }

        $scope.redirect = function (c) {
            $rootScope.setChatDataConnection(c);
            $scope.$apply(function () {
                console.log("Redirecting page for '" + c.label + "' request...");
                $rootScope.connectionStatus = "Connecting...";
                $location.path("/chat/" + c.metadata + "/to");
            });
        }

        /*var peer = $rootScope.getPeer();
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
        })*/

    }]);