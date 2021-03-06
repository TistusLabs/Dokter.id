'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'myApp.version',
    'myApp.doctor.dashboard',
    'myApp.patient.home',
    'myApp.doctor.home',
    'myApp.home.doctorinfo',
    'myApp.Services',
    'myApp.profile',
    'myApp.pagenotfound',
    'myApp.billing',
    'myApp.topup',
    'myApp.consultation',
    'myApp.consultations.patientinfo'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index.html',
            controller: 'mainController'
        }).otherwise({ redirectTo: '/pagenotfound' });
    }])

    .controller('mainController', ['$scope', '$rootScope', '$location', 'User', '$mdDialog', '$window', 'AppURLs', '$http', function ($scope, $rootScope, $location, User, $mdDialog, $window, AppURLs, $http) {

        var client = User.getAuthClient();
        var securityToken = client.checkSession();
        console.log("Logged in securityToken: " + securityToken);
        var session = client.getSession();

        // default values
        $scope.contextMenu = "--is-hidden";

        $rootScope.isNullOrEmptyOrUndefined = function (value) {
            return !value;
        };

        var socket = io.connect(AppURLs.socketServer);
        var postData = {
            "username": session.username,
            "status": "available"
        }
        $http.post(AppURLs.connectionStorage + '/status/set', postData)
            .success(function (data, status, headers, config) {
                socket.emit('useronline', session.username);
            })
            .error(function (data, status, header, config) {
                console.log("errorrrrr");
            });

        socket.on('call', function (broadcast) {
            if (broadcast.to.username == session.username) {
                $scope.showIncomingWindow(broadcast.from, null)
            }
        });

        $rootScope.ShowBusyContainer = function (message) {
            $rootScope.isBusy = true;
            $rootScope.bcmessage = message;
        };

        $rootScope.HideBusyContainer = function () {
            $rootScope.isBusy = false;
        };

        $rootScope.menu = [];

        $rootScope.contextmenuitems = [];

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

        $scope.openWindow = function (path) {
            $location.path(path);
        };

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $rootScope.displayMessage = function (message, title, ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Okay')
                    .targetEvent(ev)
            );
        };

        var onceDisplayed = false;
        $scope.saveInTimeIntervals = function () {
            setInterval(function () {
                if (!onceDisplayed) {
                    $scope.showUpdateProfile(null);
                    onceDisplayed = true;
                }
            }, 1000);
        };

        $scope.saveInTimeIntervals();

        $scope.showUpdateProfile = function (ev) {
            $mdDialog.show({
                controller: 'profileCompleteDialog',
                templateUrl: 'partials/platform-entry.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    data: $rootScope.userObject
                }
            })
                .then(function (doctor) {

                }, function () {

                });
        };
        //$scope.showUpdateProfile(null);

        $rootScope.setTokSession = function (obj) {
            $rootScope.toksessionObj = obj;
        };
        $rootScope.getTokSession = function () {
            return $rootScope.toksessionObj;
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
                        }, {
                            "caption": "Dashboard",
                            "route": "/doctor/dashboard",
                            "icon": "build/img/navigation/side/dashboard.png"
                        },
                        {
                            caption: "Consultations",
                            route: "/consultations",
                            icon: "build/img/navigation/side/consultation.png"
                        },
                        {
                            "caption": "Billing",
                            "route": "/billing",
                            "icon": "build/img/navigation/side/billing.png"
                        }
                    ];
                    $rootScope.contextmenuitems = [
                        {
                            "caption": "Settings",
                            "route": "/profile",
                            "icon": "build/img/navigation/top/setting.png"
                        },
                        {
                            "caption": "Manage Consultation",
                            "route": "",
                            "icon": "build/img/navigation/top/consultation.png"
                        },
                        {
                            "caption": "Top Up Credit",
                            "route": "/topup",
                            "icon": "build/img/navigation/top/topup.png"
                        },
                        {
                            "caption": "Manage Billing",
                            "route": "/billing",
                            "icon": "build/img/navigation/top/billing.png"
                        },
                        {
                            "caption": "Sign Out",
                            "route": "/signout",
                            "icon": "build/img/navigation/top/signout.png"
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
                        }, {
                            caption: "Consultations",
                            route: "/consultations",
                            icon: "build/img/navigation/side/consultation.png"
                        },
                        {
                            caption: "Billing",
                            route: "/billing",
                            icon: "build/img/navigation/side/billing.png"
                        }
                    ];
                    $rootScope.contextmenuitems = [
                        {
                            "caption": "Settings",
                            "route": "/profile",
                            "icon": "build/img/navigation/top/setting.png"
                        },
                        {
                            "caption": "Top Up Credit",
                            "route": "/topup",
                            "icon": "build/img/navigation/top/topup.png"
                        },
                        {
                            "caption": "Manage Billing",
                            "route": "/billing",
                            "icon": "build/img/navigation/top/billing.png"
                        },
                        {
                            "caption": "Sign Out",
                            "route": "/signout",
                            "icon": "build/img/navigation/top/signout.png"
                        }
                    ];
                    break;
                }
            };
        };

        $rootScope.setStatus = function (code) {
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

        if ($rootScope.isNullOrEmptyOrUndefined($rootScope.userObject) == false) {
            debugger
            $rootScope.setStatus("available");
        }

        $scope.popSettings = function () {
            if ($scope.contextMenu == "") {
                $scope.contextMenu = "--is-hidden";
            } else {
                $scope.contextMenu = "";
            }
        }

        $scope.contextMenyClick = function (route, event) {
            if (route == "/signout") {
                $scope.logoutUser(event);
            } else {
                $location.path(route);
            }
        };

        /*$scope.$on('$locationChangeStart', function (event) {
            var answer = confirm("Do you want to exit the application properly?")
            if (answer) {
                $scope.logoutUser(event);
            }
            //$scope.logoutUser(event);
    });*/

        // $scope.$on('$destroy', function (event) {
        //     $scope.logoutUser(event);
        // });
        /* window.onbeforeunload = function (event) {
             var message = 'Do you want to exit the application the proper way?';
             if (typeof event == 'undefined') {
                 event = window.event;
             }
             if (event) {
                 event.returnValue = message;
             }
             return message;
     }*/

        $scope.logoutUser = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .textContent('Do you really want to signout?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Sign Out')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                // signout 
                var socket = io.connect(AppURLs.socketServer);
                var obj = {
                    user: $rootScope.userObject.username,
                    status: "unavailable"
                }
                var postData = {
                    "username": $rootScope.userObject.username,
                    "status": "unavailable"
                }
                $http.post(AppURLs.connectionStorage + '/status/set', postData)
                    .success(function (data, status, headers, config) {
                        socket.on('statuschange', function (obj) {
                            if (obj.user == $rootScope.userObject.username && obj.status == "unavailable") {
                                var client = new User.getAuthClient();
                                client.signOut();
                                $window.location.href = "/Dokter.id/auth";
                            }
                        });
                        socket.emit('statuschange', obj);
                    })
                    .error(function (data, status, header, config) {
                        console.log("errorrrrr");
                    });
            }, function () {
                // will do nothing.
            });
        };

        $scope.showIncomingWindow = function (data, ev) {
            $mdDialog.show({
                controller: 'incomingWindowController',
                templateUrl: 'partials/doctor-answering.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false,
                locals: {
                    data: data
                },
                closeTo: {
                    bottom: 0
                }
            })
                .then(function (patient) {
                    if (!$rootScope.isNullOrEmptyOrUndefined(patient.username)) {
                        $scope.showCallRejectedWindow(patient, ev)
                    } else {
                        // if the doctor accepts the call the consultation should be created.
                        debugger
                        var objtoStore = {
                            doctor: $rootScope.userObject.username,
                            patient: data.username,
                            startdatetime: new Date(),
                            enddatetime: new Date()
                        }
                        debugger
                        var client = User.getClient();
                        client.onComplete(function (consultationData) {
                            // change user status to in call before sending to the call page
                            $rootScope.setStatus("call");

                            // send that the user has answered the call
                            socket.emit('answercall', data);
                            location.href = "/Dokter.id/conference";
                        });
                        client.onError(function (data) {
                            console.log("error when consultation is stored.");
                        });
                        client.SaveConsultation(objtoStore);
                    }
                }, function () {
                    console.log("OOps");
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
                .then(function () {

                }, function () {
                    console.log("OOps");
                });
        };


        // temporary cuz login is not yet functioning
        if (session.type == "doctor") {
            $location.path("/doctor/home");
        } else {
            $location.path("/patient/home");
        }
        $rootScope.setMenu(session.type);
        if (session.profileimage == "") {
            var passhash = CryptoJS.MD5(session.username);
            session.profileimage = "https://www.gravatar.com/avatar/" + passhash;
        }
        $rootScope.userObject = session;
    }]).controller('incomingWindowController', ['$scope', '$rootScope', 'data', '$mdDialog', 'AppURLs', function ($scope, $rootScope, data, $mdDialog, AppURLs) {

        $scope.patient = data;
        var socket = io.connect(AppURLs.socketServer);

        $scope.rejectCall = function () {
            socket.emit('callrejected', $scope.patient);
            $mdDialog.hide();
        }

        socket.on('callrejected', function (broadcast) {
            debugger;
            if (broadcast.username == $scope.patient.username) {
                $mdDialog.hide($scope.patient);
            }
        });

        $scope.acceptCall = function () {
            var obj = {
                "mode": "accept"
            }
            $mdDialog.hide(obj);
        }
    }]).controller('profileCompleteDialog', ['$scope', '$rootScope', 'data', '$mdDialog', 'AppURLs', '$location', function ($scope, $rootScope, data, $mdDialog, AppURLs, $location) {
        $scope.profile = data;
        $scope.close = function () {
            $mdDialog.hide();
        }

        $scope.gotoProfile = function () {
            $location.path('/profile');
            $mdDialog.hide();
        }
    }]);
