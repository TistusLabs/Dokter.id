'use strict';

angular.module('conferenceApp.call', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/call', {
            templateUrl: 'call-partial.html',
            controller: 'callController'
        });
    }])

    .controller('callController', ['$scope', '$rootScope', '$location', 'User', '$window', '$mdDialog', 'AppURLs', function($scope, $rootScope, $location, User, $window, $mdDialog, AppURLs) {

        var client = User.getAuthClient();

        $scope.msgHistory = [];

        /*$scope.msgHistory.push({
            message: "Hey doc wht's up?",
            name: $rootScope.userObject.name,
            time: new Date(),
            image: $rootScope.userObject.profileimage
        });*/

        var tokboxSession = client.getTokSession();

        $scope.apiKey = tokboxSession.apiKey;
        $scope.sessionId = tokboxSession.sessionId;
        $scope.token = tokboxSession.token;

        var socket = io.connect(AppURLs.socketServer);
        socket.on('callended', function(broadcast) {
            if (broadcast == $scope.sessionId) {
                location.href = "/dokter.id/";
            }
        });

        var session = OT.initSession($scope.apiKey, $scope.sessionId);

        $scope.initializeSession = function() {

            // Subscribe to a newly created stream
            session.on('streamCreated', function(event) {
                session.subscribe(event.stream, 'subscriber', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%'
                });
            });

            session.on('sessionDisconnected', function(event) {
                console.log('You were disconnected from the session.', event.reason);
            });

            // Connect to the session
            session.connect($scope.token, function(error) {
                // If the connection is successful, initialize a publisher and publish to the session
                if (!error) {
                    var publisher = OT.initPublisher('publisher', {
                        insertMode: 'append',
                        width: '100%',
                        height: '100%'
                    });

                    session.publish(publisher);
                } else {
                    console.log('There was an error connecting to the session: ', error.code, error.message);
                }
            });

            // Receive a message and append it to the history
            session.on('signal:msg', function(event) {
                $scope.$apply(function() {
                    $scope.msgHistory.push(event.data);
                });
            });
        };
        $scope.initializeSession();

        $scope.endCall = function(ev) {
            console.log("opening window");
            $mdDialog.show({
                controller: 'callcancelling',
                templateUrl: '../partials/call-canceling.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false
            })
                .then(function(result) {
                    if (result) {
                        socket.emit('callended', $scope.sessionId);
                        location.href = "/dokter.id/";
                    }
                }, function() {
                    console.log("OOps");
                });
        };

        $scope.sendMessage = function() {
            //debugger;

            var msg = {
                message: $scope.txtMessage,
                name: $rootScope.userObject.name,
                time: new Date(),
                image: $rootScope.userObject.profileimage
            };
            $scope.txtMessage = "";
            session.signal({
                type: 'msg',
                data: msg
            }, function(error) {
                if (error == undefined) {
                    $scope.$apply(function() {
//                        $scope.msgHistory.push(event.data);
                    });
                }
            });
        };

    }]).controller('callcancelling', ['$scope', '$rootScope', '$mdDialog', 'AppURLs', function($scope, $rootScope, $mdDialog, AppURLs) {

        $scope.closeCall = function() {
            $mdDialog.hide(true);
        };

        $scope.cancelWindow = function() {
            $mdDialog.hide(false);
        };
    }]);