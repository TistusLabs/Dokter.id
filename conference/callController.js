'use strict';

angular.module('conferenceApp.call', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/call', {
            templateUrl: 'call-partial.html',
            controller: 'callController'
        });
    }])

    .controller('callController', ['$scope', '$rootScope', '$location', 'User', '$window', '$mdDialog', 'AppURLs', function ($scope, $rootScope, $location, User, $window, $mdDialog, AppURLs) {

        var client = User.getAuthClient();

        $scope.msgHistory = [];
        $scope.subscriberName = "";

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
        socket.on('callended', function (broadcast) {
            if (broadcast == $scope.sessionId) {
                location.href = "/Dokter.id/";
            }
        });

        var session = OT.initSession($scope.apiKey, $scope.sessionId);
        var subsciber = new Object();
        var publisher = new Object();

        $scope.getProfileDetails = function (username, event) {
            var client = User.getClient();
            client.onComplete(function (data) {
                debugger
                $scope.subscriberName = event.stream.name;
                subsciber = session.subscribe(event.stream, 'subscriber', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                    name: event.stream.name,
                    style: {
                        nameDisplayMode: "off",
                        buttonDisplayMode: "off"
                    }
                });
            });
            client.onError(function (data) {

            });
            client.GetUserByUsername(username);
        };

        $scope.initializeSession = function () {

            // Subscribe to a newly created stream
            session.on('streamCreated', function (event) {
                debugger
                // get profile details
                // $scope.getProfileDetails(event.stream.name,event);
                $scope.subscriberName = event.stream.name;
                $scope.subscriberUsername = event.stream.name;
                subsciber = session.subscribe(event.stream, 'subscriber', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                    name: event.stream.name,
                    style: {
                        nameDisplayMode: "off",
                        buttonDisplayMode: "off"
                    }
                });
            });

            session.on('sessionDisconnected', function (event) {
                console.log('You were disconnected from the session.', event.reason);
            });

            // Connect to the session
            session.connect($scope.token, function (error) {
                // If the connection is successful, initialize a publisher and publish to the session
                if (!error) {
                    var pub = OT.initPublisher('publisher', {
                        insertMode: 'append',
                        width: '100%',
                        height: '100%',
                        name: $rootScope.userObject.username,
                        style: {
                            nameDisplayMode: "off",
                            buttonDisplayMode: "off"
                        }
                    });

                    publisher = session.publish(pub);
                } else {
                    console.log('There was an error connecting to the session: ', error.code, error.message);
                }
            });

            // Receive a message and append it to the history
            session.on('signal:msg', function (event) {
                $scope.$apply(function () {
                    $scope.msgHistory.push(event.data);
                });
            });
        };
        $scope.initializeSession();

        socket.on('unmutevoice', function (username) {
            if ($scope.subscriberName == username) {
                subsciber.subscribeToAudio(true);
            }
        });
        socket.on('mutevoice', function (username) {
            if ($scope.subscriberName == username) {
                subsciber.subscribeToAudio(false);
            }
        });
        socket.on('unmutevideo', function (username) {
            if ($scope.subscriberName == username) {
                subsciber.subscribeToVideo(false);
            }
        });
        socket.on('mutevideo', function (username) {
            if ($scope.subscriberName == username) {
                subsciber.subscribeToVideo(true);
            }
        });

        $scope.isAudioMuted = false;
        $scope.muteAudio = function () {
            //debugger
            if ($scope.isAudioMuted) {
                //publisher.subscribeToAudio(true);
                // unmute
                socket.emit('unmutevoice', $rootScope.userObject.name);
                //subsciber.subscribeToAudio(false);
            } else {
                //publisher.subscribeToAudio(false);
                // mute voice
                socket.emit('mutevoice', $rootScope.userObject.name);
                //subsciber.subscribeToAudio(true);
            }
            $scope.isAudioMuted = !$scope.isAudioMuted;
        };

        $scope.isVideoMuted = false;
        $scope.muteVideo = function () {
            //debugger
            if ($scope.isVideoMuted) {
                //publisher.subscribeToVideo(false);
                // un mute video
                //socket.emit('unmutevideo', $rootScope.userObject.name);
            } else {
                //publisher.subscribeToVideo(true);
                // mute video
                //socket.emit('mutevideo', $rootScope.userObject.name);
            }
            $scope.isVideoMuted = !$scope.isVideoMuted;
        };

        $scope.endCall = function (ev) {
            console.log("opening window");
            $mdDialog.show({
                controller: 'callcancelling',
                templateUrl: '../partials/call-canceling.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false
            })
                .then(function (result) {
                    if (result) {
                        socket.emit('callended', $scope.sessionId);
                        location.href = "/Dokter.id/";
                    }
                }, function () {
                    console.log("OOps");
                });
        };

        $scope.sendMessageOnEnter = function (event) {
            if (event.code == "Enter") {
                $scope.sendMessage();
            }
        }

        $scope.sendMessage = function () {
            var msg = {
                message: $scope.txtMessage,
                name: $rootScope.userObject.name,
                time: new Date(),
                image: $rootScope.userObject.profileimage
            };

            var objtoStore = {
                message: $scope.txtMessage,
                fromusername: $rootScope.userObject.username,
                tousername: $scope.subscriberUsername,
                datetime: msg.time.toString(),
            }
            $scope.txtMessage = "";
            session.signal({
                type: 'msg',
                data: msg
            }, function (error) {
                if (error == undefined) {
                    $scope.$apply(function () {
                    });
                }
            });

            // storing messages
            var client = User.getClient();
            client.onComplete(function (data) {
                console.log("Message stored.");
            });
            client.onError(function (data) {
                console.log("error when Message is stored.");
            });
            client.SaveMessage(objtoStore);
        };

    }]).controller('callcancelling', ['$scope', '$rootScope', '$mdDialog', 'AppURLs', function ($scope, $rootScope, $mdDialog, AppURLs) {

        $scope.closeCall = function () {
            $mdDialog.hide(true);
        };

        $scope.cancelWindow = function () {
            $mdDialog.hide(false);
        };
    }]);