'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'myApp.signup',
    'myApp.signup.patient',
    'myApp.signup.doctor',
    'myApp.doctor.dashboard',
    'myApp.patient.home',
    'myApp.doctor.home',
    'myApp.home.doctorinfo',
    'myApp.chat',
    'myApp.Services',
    'myApp.myprofile.doctor',
    'myApp.pagenotfound',
    'myApp.mypatients'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/pagenotfound' });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', function ($scope, $rootScope, $location, User, $mdDialog) {
        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

        $rootScope.menu = [];
        
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
        
        $scope.openWindow = function(path){
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
                            caption: "Home",
                            route: "/doctor/home",
                            icon: "build/img/navigation/side/home.png"
                        },{
                            "caption": "Dashboard",
                            "route": "/doctor/dashboard",
                            "icon":"build/img/navigation/side/dashboard.png"
                        },
                        {
                            caption: "Consultation",
                            route: "/consultation",
                            icon: "build/img/navigation/side/consultation.png"
                        },
                        {
                            "caption": "Billing",
                            "route": "/billing",
                            "icon":"build/img/navigation/side/billing.png"
                        }
                    ];
                    break;
                }
                case "patient": {
                    $rootScope.menu = [
                        {
                            caption: "Home",
                            route: "/patient/home",
                            icon: "build/img/navigation/side/home.png"
                        },
                        {
                            caption: "Billing",
                            route: "/patient/billing",
                            icon: "build/img/navigation/side/billing.png"
                        }
                    ];
                    break;
                }
            };
        };
        $rootScope.setMenu('patient');
        $rootScope.userObject = {
                    id: "1",
                    name: "Shehan Tissera",
                    username: 'shehan@gmail.com',
                    password: 'shehan',
                    status: "available",
                    type: "doctor",
                    country: "Sri Lanka",
                    city: "Colombo",
                    languages: ["English", "Indonesian"],
                    profileimage: "http://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c",
                    peer: {},
                    otherdata: {
                        speciality: "Specialist in Angular",
                        currency:"USD",
                        rate: "50",
                        shortbiography: "Pationate in whatever the task is.",
                        awards: "1st place in all places",
                        graduateschool: "Cardif Metropolitan",
                        residenceplace: "Colombo"
                    }
                };
    }]);
