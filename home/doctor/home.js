'use strict';

angular.module('myApp.doctor.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/doctor/home', {
            templateUrl: 'home/doctor/home.html',
            controller: 'dochomeControll'
        });
    }])

    .controller('dochomeControll', ['$scope', '$rootScope', '$location', 'User', 'AppURLs', '$http', function ($scope, $rootScope, $location, User, AppURLs, $http) {
        //$rootScope.checkSession();

        /*var client = User.getClient();
        client.onComplete(function(data) {
            $scope.doctor = data;
            $scope.currentPeerID = data.peer.id;
        });
        client.GetCurrentUser();*/

        $scope.doctor = $rootScope.userObject;
        $scope.currentPeerID = "1";

        $scope.redirect = function (c) {
            $rootScope.setChatDataConnection(c);
            $rootScope.setPartnerPeerID(c.peer);
            $scope.$apply(function () {
                console.log("Redirecting page for '" + c.label + "' request...");
                $rootScope.connectionStatus = "Connecting...";
                $location.path("/chat/" + c.metadata + "/to");
            });
        }

        $scope.onlinestatuses = ['available', 'unavailable', 'maybe'];

        /*var user = $rootScope.userObject;
        $scope.doctor = user;
        $scope.currentPeerID = "1";*/

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

        $scope.gotoChatRoom = function () {
            $location.path("/chat/4/from");
        }

        $scope.pingserver = function () {
            peer.socket.send({ type: 'ping' });
        }

        $scope.setStatus = function (code) {
            var socket = io.connect(AppURLs.socketServer);
            var obj = {
                user: $rootScope.userObject.username,
                status: code
            }
            var postData = {
                "username": $rootScope.userObject.username,
                "status": code
            }
            $http.post(AppURLs.connectionStorage + '/status/set', postData)
                .success(function (data, status, headers, config) {
                    socket.emit('statuschange', obj);
                })
                .error(function (data, status, header, config) {
                    console.log("");
                });
        }

    }]);