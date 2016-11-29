'use strict';

angular.module('conferenceApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'myApp.Services'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/call', {
            templateUrl: 'index.html',
            controller: 'mainController'
        });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', '$routeParams', '$route', function ($scope, $rootScope, $location, User, $mdDialog, $routeParams, $route) {

        var client = User.getAuthClient();
        var securityToken = client.checkSession();

        var tokboxSession = client.getTokSession();
        
        $scope.apiKey = tokboxSession.apiKey;
        $scope.sessionId = tokboxSession.sessionId;
        $scope.token = tokboxSession.token;

        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

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

    }]);
