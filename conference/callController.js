'use strict';

angular.module('conferenceApp.call', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/call', {
            templateUrl: 'call-partial.html',
            controller: 'callController'
        });
    }])

    .controller('callController', ['$scope', '$rootScope', '$location', 'User', '$window', '$mdDialog', function ($scope, $rootScope, $location, User, $window, $mdDialog) {

        var client = User.getAuthClient();
        var securityToken = client.checkSession();

        var tokboxSession = client.getTokSession();

        $scope.apiKey = tokboxSession.apiKey;
        $scope.sessionId = tokboxSession.sessionId;
        $scope.token = tokboxSession.token;

        $scope.initializeSession = function () {
            var session = OT.initSession($scope.apiKey, $scope.sessionId);

            // Subscribe to a newly created stream
            session.on('streamCreated', function (event) {
                session.subscribe(event.stream, 'subscriber', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%'
                });
            });

            session.on('sessionDisconnected', function (event) {
                console.log('You were disconnected from the session.', event.reason);
            });

            // Connect to the session
            session.connect($scope.token, function (error) {
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
        };
        $scope.initializeSession();

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
                .then(function (answer) {
                    console.log("buhaha");
                }, function () {
                    console.log("OOps");
                });
        };

        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent('You can specify some description text in here.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
    }]).controller('callcancelling', ['$scope', '$rootScope', '$mdDialog', 'AppURLs', function ($scope, $rootScope, $mdDialog, AppURLs) {

        $scope.closeWindow = function () {
            $mdDialog.hide();
        }
    }]);