'use strict';

angular.module('myApp.patient.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/home', {
            templateUrl: 'home/patient/home.html',
            controller: 'patientHomeControll'
        });
    }])

    .controller('patientHomeControll', ['$scope', '$rootScope', '$location', 'User', 'AppURLs', '$mdDialog', function ($scope, $rootScope, $location, User, AppURLs, $mdDialog) {
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
                    debugger;
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
                if (doc.profileimage == "") {
                    var passhash = CryptoJS.MD5(doc.username);
                    doc.profileimage = "http://www.gravatar.com/avatar/" + passhash;
                }
            });
            $scope.doctors = data;
            $scope.isLoading = false;
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
                    if(doctor){
                        $scope.showCallRejectedWindow(doctor,ev)
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

    }]).controller('callingWindowController', ['$scope', '$rootScope', 'data', '$mdDialog','AppURLs', function ($scope, $rootScope, data, $mdDialog,AppURLs) {
        $scope.doctor = data;

        var socket = io.connect(AppURLs.socketServer);
        var broadcast = {
            from : $rootScope.userObject,
            to : $scope.doctor
        }
        socket.emit('call', broadcast);
        socket.on('callrejected', function(broadcast) {
            if (broadcast.username == $rootScope.userObject.username) {
                $mdDialog.hide($scope.doctor);
            }
        });
        socket.on('answercall', function(broadcast) {
            if (broadcast.username == $rootScope.userObject.username) {
                // answer the call.. navigate to the call page
            }
        });

        $scope.closeWindow = function () {
            socket.emit('callrejected', $rootScope.userObject);
            $mdDialog.hide();
        }
    }]).controller('callrejectedWindowController', ['$scope', '$rootScope', 'data', '$mdDialog','AppURLs', function ($scope, $rootScope, data, $mdDialog,AppURLs) {
        $scope.doctor = data;

        $scope.closeWindow = function () {
            $mdDialog.hide();
        }
    }]);