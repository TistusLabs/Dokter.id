'use strict';

// Declare app level module which depends on views, and components
angular.module('loginApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'loginApp.signin',
    'myApp.Services'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/signin' });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', function ($scope, $rootScope, $location, User, $mdDialog) {
        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

        $rootScope.menu = [
            {
                "caption": "Login Page",
                "route": "/login"
            }
        ];
        
        $rootScope.submenu = [
            {
                "caption": "Account Settings",
                "code": "settings"
            },
            {
                "caption": "Dashboard",
                "code": "dashboard"
            },
            {
                "caption": "Manage Patients",
                "code": "managepatients"
            },
            {
                "caption": "Sign Out",
                "code": "signout"
            }
        ];

        $rootScope.peerObj = null;
        $rootScope.peerPartnerID = "";
        $rootScope.chatdataConnection = null;
        $rootScope.filedataConnection = null;
        $rootScope.validSession = false;
        $rootScope.checkSession = function () {
            if (!angular.isDefined($rootScope.username) || $rootScope.username == null) {
                // can check for a cookies if its available instead of rootScope variable
                $location.path('/login');
                $rootScope.setMenu('login');
                $rootScope.validSession = false;
            } else {
                $rootScope.validSession = true;
            }
        };
        
        $scope.openWidow = function(path){
            $location.path(path);
        };

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $rootScope.setPeer = function (peer) {
            $rootScope.peerObj = peer;
        };
        $rootScope.getPeer = function () {
            return $rootScope.peerObj;
        };
        $rootScope.setPartnerPeerID = function (peer) {
            $rootScope.peerPartnerID = peer;
        };
        $rootScope.getPartnerPeerID = function (peer) {
            return $rootScope.peerPartnerID;
        };
        $rootScope.setChatDataConnection = function (data) {
            $rootScope.chatdataConnection = data;
        };
        $rootScope.getChatDataConnection = function () {
            return $rootScope.chatdataConnection;
        };
        $rootScope.setFileDataConnection = function (data) {
            $rootScope.filedataConnection = data;
        };
        $rootScope.getFileDataConnection = function () {
            return $rootScope.filedataConnection;
        };
        $rootScope.setMenu = function (type) {
            switch (type) {
                case "login": {
                    $rootScope.menu = [
                        {
                            "caption": "Login Page",
                            "route": "/login"
                        },
                        {
                            "caption": "Sign up as Patient",
                            "route": "/signup/patient"
                        },
                        {
                            "caption": "Sign up as Doctor",
                            "route": "/signup/doctor"
                        }
                    ];
                    break;
                }
                case "signup": {
                    $rootScope.menu = [
                        {
                            "caption": "Login Page",
                            "route": "/login"
                        },
                        {
                            "caption": "Sign up as Patient",
                            "route": "/signup/patient"
                        },
                        {
                            "caption": "Sign up as Doctor",
                            "route": "/signup/doctor"
                        }
                    ];
                    break;
                }
                case "doctor": {
                    $rootScope.menu = [
                        {
                            "caption": "Dashboard",
                            "route": "/doctor/dashboard/",
                            "icon":"ion-grid"
                        },
                        {
                            "caption": "Profile",
                            "route": "/doctor/profile",
                            "icon":"ion-person"
                        },
                        {
                            "caption": "My Patients",
                            "route": "/doctor/patients/",
                            "icon":"ion-person-stalker"
                        },
                        {
                            "caption": "Billing",
                            "route": "/billing",
                            "icon":"ion-card"
                        }
                    ];
                    break;
                }
                case "patient": {
                    $rootScope.menu = [
                        {
                            "caption": "Dashboard",
                            "route": "/patient/dashboard/"
                        },
                        {
                            "caption": "Logout",
                            "route": "/logout"
                        }
                    ];
                    break;
                }
            };
        };
    }]);