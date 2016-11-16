'use strict';

angular.module('myApp.doctor.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/doctor/dashboard', {
            templateUrl: 'dashboard/doctor/dashboard.html',
            controller: 'docdashboardControll'
        });
    }])

    .controller('docdashboardControll', ['$scope', '$rootScope', '$location', 'User', function ($scope, $rootScope, $location, User) {
        $rootScope.checkSession();

        /*var client = User.getClient();
        client.onComplete(function(data) {
            $scope.doctor = data;
            $scope.currentPeerID = data.peer.id;
        });
        client.GetCurrentUser();*/
        $scope.redirect = function (c) {
            $rootScope.setChatDataConnection(c);
            $rootScope.setPartnerPeerID(c.peer);
            $scope.$apply(function () {
                console.log("Redirecting page for '"+c.label +"' request...");
                $rootScope.connectionStatus = "Connecting...";
                $location.path("/chat/" + c.metadata + "/to");
            });
        }
        
        $scope.onlinestatuses = ['Available','Unavailable','Maybe'];

        var user = $rootScope.userObject;
        $scope.doctor = user;
        $scope.currentPeerID = user.peer.id;

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

        $scope.gotoChatRoom = function () {
            $location.path("/chat/4/from");
        }

         $scope.pingserver = function(){
            peer.socket.send({type: 'ping'});
        }


    }]);