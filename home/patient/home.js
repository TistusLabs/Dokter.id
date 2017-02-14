'use strict';

angular.module('myApp.patient.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/home', {
            templateUrl: 'home/patient/home.html',
            controller: 'patientHomeControll'
        });
    }])

    .controller('patientHomeControll', ['$scope', '$rootScope', '$location', 'User', 'AppURLs', '$mdDialog','$http', function ($scope, $rootScope, $location, User, AppURLs, $mdDialog,$http) {
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

        $scope.setUserStatus = function (data) {
            angular.forEach($scope.doctors, function (doctor, index) {
                if (doctor.username == data.user) {
                    $scope.$apply(function () {
                        doctor.status = data.status;
                    });
                }
            });
        }
        var socket = io.connect(AppURLs.socketServer);
        socket.on('useronline', function (username) {
            //make a fd service call and update the user on DB
            $scope.setUserOnline(username);
        });

        socket.on('statuschange', function (obj) {
            //make a fd service call and update the user on DB
            $scope.setUserStatus(obj);
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

                    angular.forEach(data.value, function (status, index) {
                        status = JSON.parse(status);
                        angular.forEach(doctors, function (doctor, index) {
                            if (doctor.username == status.username) {
                                doctor.status = status.status;
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

        $scope.sendtoMessageArea = function(doctor){
            $location.path("/patient/home/doctor/"+doctor._id+"/message");
        };

        $scope.showCallingWindow = function (data, ev) {
            $mdDialog.show({
                controller: 'callingWindowController',
                templateUrl: 'partials/patient-calling.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false,
                locals: {
                    data: data
                }
            })
                .then(function (doctor) {
                    if (doctor) {
                        $scope.showCallRejectedWindow(doctor, ev)
                    }
                }, function () {

                });
        };

        $scope.showCallRejectedWindow = function (data, ev) {
            $mdDialog.show({
                controller: 'callrejectedWindowController',
                templateUrl: 'partials/doctor-callrejected.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false,
                locals: {
                    data: data
                }
            })
                .then(function (answer) {
                    console.log("buhaha");
                }, function () {
                    console.log("OOps");
                });
        };

    }]).controller('callingWindowController', ['$scope', '$rootScope', 'data', '$mdDialog', 'AppURLs', function ($scope, $rootScope, data, $mdDialog, AppURLs) {
        $scope.doctor = data;

        var socket = io.connect(AppURLs.socketServer);
        var broadcast = {
            from: $rootScope.userObject,
            to: $scope.doctor
        }
        socket.emit('call', broadcast);
        socket.on('callrejected', function (broadcast) {
            if (broadcast.username == $rootScope.userObject.username) {
                $mdDialog.hide($scope.doctor);
            }
        });
        socket.on('answercall', function (broadcast) {
            if (broadcast.username == $rootScope.userObject.username) {
                // change userstatus to in call before sending to the call page
                $rootScope.setStatus("call");
                // send to call page
                location.href = "/Dokter.id/conference";
            }
        });

        $scope.closeWindow = function () {
            socket.emit('callrejected', $rootScope.userObject);
            $mdDialog.hide();
        }
    }]).controller('callrejectedWindowController', ['$scope', '$rootScope', 'data', '$mdDialog', 'AppURLs', function ($scope, $rootScope, data, $mdDialog, AppURLs) {
        $scope.doctor = data;

        $scope.closeWindow = function () {
            $mdDialog.hide();
        }
    }]);