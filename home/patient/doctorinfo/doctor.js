'use strict';

angular.module('myApp.home.doctorinfo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patient/home/doctor/:doctorID/:view', {
            templateUrl: 'home/patient/doctorinfo/doctor.html',
            controller: 'doctorControl'
        });
    }])

    .controller('doctorControl', ['$scope', '$rootScope', '$routeParams', 'User', '$location', '$http', 'AppURLs', function ($scope, $rootScope, $routeParams, User, $location, $http, AppURLs) {
        //$rootScope.checkSession();
        console.log("Recieved id:", $routeParams.doctorID);
        console.log("Recieved View:", $routeParams.view);

        $scope.loadingchatdata = true;

        $scope.setUserOnline = function (username) {
            if ($scope.doctor.username == username) {
                $scope.$apply(function () {
                    $scope.doctor.status = "available";
                });
            }
        }

        $scope.setUserStatus = function (data) {
            if ($scope.doctor.username == data.user) {
                $scope.$apply(function () {
                    $scope.doctor.status = data.status;
                });
            }
        }
        var socket = io.connect(AppURLs.socketServer);
        socket.on('useronline', function (username) {
            //make a fd service call and update the user on DB
            $scope.setUserOnline(username);
        });

        socket.on('statuschange', function (obj) {
            //make a fd service call and update the user on DB
            $scope.setUserStatus(obj);
        });

        $scope.getConsultationHistory = function () {
            var client = User.getClient();
            client.onComplete(function (data) {
                angular.forEach(data, function (patient) {
                    var passhash = CryptoJS.MD5(patient.doctor);
                    patient.profileimage = "http://www.gravatar.com/avatar/" + passhash;

                    patient.startdatetime = new Date(patient.startdatetime);
                    patient.enddatetime = new Date(patient.enddatetime);

                    var duration = patient.enddatetime - patient.startdatetime;
                    var duration = new Date(duration);
                    var seconds = duration.getUTCSeconds();
                    var minutes = duration.getUTCMinutes();
                    var hours = duration.getUTCHours();

                    patient.duration = minutes + " : " + seconds;
                });
                $scope.myConsultations = data;
                $scope.isloading = false;
            });
            client.onError(function (data) {
                console.log("There was an error loading the consultations");
            });
            client.GetAllMyConsultationsWithDoctor($scope.doctor.username, $rootScope.userObject.username);
        }

        $scope.getChatHistory = function (doctor) {
            $http.get(AppURLs.APIUrl + '/messages?fromusername__in=' + doctor.username + ',' + $rootScope.userObject.username + '&tousername__in=' + $rootScope.userObject.username + ',' + doctor.username).
                success(function (data, status, headers, config) {
                    var msgHistory = data;
                    var unreadMsgs = [];
                    msgHistory.forEach(function (chat) {
                        if (chat.fromusername == doctor.username) {
                            chat.fromName = doctor.name;
                            var passhash = CryptoJS.MD5(doctor.username);
                            chat.profileimage = "http://www.gravatar.com/avatar/" + passhash;
                        }
                        if (chat.fromusername == $rootScope.userObject.username) {
                            chat.fromName = $rootScope.userObject.name;
                            var passhash = CryptoJS.MD5($rootScope.userObject.username);
                            chat.profileimage = "http://www.gravatar.com/avatar/" + passhash;
                        }
                        chat.datetime = new Date(chat.datetime);

                        // check if unread msgs are there in offline messages
                        if (chat.type == "offline") {
                            if (chat.status == "unread") {
                                unreadMsgs.push(chat);
                            }
                        }

                    }, this);
                    $scope.MessageHistory = msgHistory;
                    $scope.loadingchatdata = false;
                }).
                error(function (data, status, headers, config) {

                });
            /*var msgHistory = [
                {
                    "_id": "587360233574b415107a5873",
                    "message": "buhahaha",
                    "fromusername": "ari@gmail.com",
                    "tousername": "eko@gmail.com",
                    "datetime": "Mon Jan 09 2017 15:34:11 GMT+0530 (Sri Lanka Standard Time)",
                    "__v": 0
                },
                {
                    "_id": "587362613574b415107a5874",
                    "message": "bebotheee buuhaaa",
                    "fromusername": "ari@gmail.com",
                    "tousername": "eko@gmail.com",
                    "datetime": "Mon Jan 09 2017 15:43:51 GMT+0530 (Sri Lanka Standard Time)",
                    "__v": 0
                },
                {
                    "_id": "5873631b3574b415107a5875",
                    "message": "my second message",
                    "tousername": "ari@gmail.com",
                    "fromusername": "eko@gmail.com",
                    "datetime": "Mon Jan 09 2017 15:33:24 GMT+0530 (Sri Lanka Standard Time)",
                    "__v": 0
                }
            ]*/
        };

        var client = User.getClient();
        client.onComplete(function (data) {
            var passhash = CryptoJS.MD5(data.object.username);
            data.object.profileimage = "http://www.gravatar.com/avatar/" + passhash;
            $scope.doctor = data.object;

            // get the current status of the user$http.get(AppURLs.connectionStorage + '/status/getall').
            $http.get(AppURLs.connectionStorage + '/status/getall').
                success(function (data, status, headers, config) {

                    angular.forEach(data.value, function (status, index) {
                        var docObj = JSON.parse(status);
                        if (docObj.username == $scope.doctor.username) {
                            $scope.doctor.status = docObj.status;
                        }
                    });
                }).
                error(function (data, status, headers, config) {
                    console.log("Oops error");
                });

            // get messages from logged in user and this doctor
            $scope.getChatHistory($scope.doctor);

            // get consultation consultation history
            $scope.getConsultationHistory();
        });
        client.GetUserID($routeParams.doctorID);

        $scope.sendMessageOnEnter = function (event) {
            if (event.key == "Enter") {
                $scope.sendMessage();
            }
        }

        $scope.sendMessage = function () {

            var time = new Date();

            var objtoStore = {
                message: $scope.txtMessage,
                fromusername: $rootScope.userObject.username,
                tousername: $scope.doctor.username,
                datetime: time.toString(),
                type: "offline",
                status: "unread",
                msgtype: "message"
            }
            $scope.txtMessage = "";

            // storing messages
            var client = User.getClient();
            client.onComplete(function (data) {
                $scope.getChatHistory($scope.doctor);
                //alert("The message has been successfully sent!");
            });
            client.onError(function (data) {
                console.log("error when Message is stored.");
            });
            client.SaveMessage(objtoStore);
        };

        $scope.sendFile = function () {

            // sending file to server
            var file = $scope.attachedFile;
            var filename = file.name;
            var stream = ss.createStream();
            ss(socket).emit('file', stream, { name: filename });
            ss.createBlobReadStream(file).pipe(stream);

            var downloadFileLocation = FILE_UPLOAD_LOCATION + filename;

            //saving and sending message to other

            var objtoStore = {
                message: downloadFileLocation,
                fromusername: $rootScope.userObject.username,
                tousername: $scope.doctor.username,
                datetime: new Date().toString(),
                type: "offline",
                status: "unread",
                msgtype: "file"
            }

            // storing messages
            var client = User.getClient();
            client.onComplete(function (data) {
                document.getElementById("attachedFile").value = "";
                $scope.getChatHistory($scope.doctor);
            });
            client.onError(function (data) {
                console.log("error when Message is stored.");
            });
            client.SaveMessage(objtoStore);
        };

        $scope.openChatWindow = function (doctor) {
            // get from cache and set partnerPeer ID
            //$rootScope.setPartnerPeerID(c.peer);
            $rootScope.connectionStatus = "Connecting...";
            $location.path("/chat/" + doctor.id + "/from");
        };

        $scope.backtoDashboard = function () {
            $location.path("/patient/dashboard/");
        };

        $scope.arrayToString = function (string) {
            return string.join(", ");
        };

        $scope.tabs = {}
        $scope.tabs.overview = true;
        $scope.tabs.message = false;
        $scope.tabs.consultationhistory = false;

        $scope.changeTab = function (tabID) {
            switch (tabID) {
                case "tabOverview": {
                    $scope.tabs.overview = true;
                    $scope.tabs.message = false;
                    $scope.tabs.consultationhistory = false;
                    break;
                }
                case "tabMessage": {
                    $scope.tabs.overview = false;
                    $scope.tabs.message = true;
                    $scope.tabs.consultationhistory = false;
                    break;
                }
                case "tabConsultationHistory": {
                    $scope.tabs.overview = false;
                    $scope.tabs.message = false;
                    $scope.tabs.consultationhistory = true;
                    break;
                }
            }
        }

        if ($routeParams.view == "overview") {
            $scope.changeTab("tabOverview");
        } else if ($routeParams.view == "message") {
            $scope.changeTab("tabMessage");
        } else if ($routeParams.view == "consultations") {
            $scope.changeTab("tabConsultationHistory");
        }

    }]).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);;