'use strict';

angular.module('myApp.patient.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/home', {
            templateUrl: 'home/patient/home.html',
            controller: 'patientHomeControll'
        });
    }])

    .controller('patientHomeControll', ['$scope', '$rootScope', '$location', 'User','AppURLs', function ($scope, $rootScope, $location, User,AppURLs) {
        /*$rootScope.checkSession();
        */
        $scope.setUserOnline = function(username){
            angular.forEach($scope.doctors, function (doctor, index) {
                if(doctor.username == username){
                    debugger;
                    $scope.$apply(function(){
                        doctor.status = "available";
                    });
                }
            });
        }
        var socket = io.connect(AppURLs.socketServer);
        socket.on('useronline', function (username) {
            //make a fd service call and update the user on DB
            debugger
            $scope.setUserOnline(username);
        });

        $scope.isLoading = true;

        var client = User.getClient();
        client.onComplete(function (data) {
            angular.forEach(data, function (doc) {
                if(doc.profileimage==""){
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