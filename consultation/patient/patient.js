'use strict';

angular.module('myApp.consultations.patientinfo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/doctor/consultations/patient/:patientID', {
            templateUrl: 'consultation/patient/patient.html',
            controller: 'patientinfoControl'
        });
    }])

    .controller('patientinfoControl', ['$scope', '$rootScope', '$routeParams', 'User', '$location','$http','AppURLs', function ($scope, $rootScope, $routeParams, User, $location,$http,AppURLs) {
        //$rootScope.checkSession();
        console.log("Recieved id:", $routeParams.patientID);

        $scope.loadingchatdata = true;

        $scope.getChatHistory = function (doctor) {
            $http.get(AppURLs.APIUrl + '/messages?fromusername__in='+doctor.username+','+$rootScope.userObject.username+'&tousername__in='+$rootScope.userObject.username+','+doctor.username).
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
                        if(chat.type == "offline")
                        {
                            if(chat.status == "unread"){
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
            debugger
            var passhash = CryptoJS.MD5(data.object.username);
            data.object.profileimage = "http://www.gravatar.com/avatar/" + passhash;
            $scope.doctor = data.object;
            // get messages from logged in user and this doctor
            $scope.getChatHistory($scope.doctor);
        });
        client.GetUserByUsername($routeParams.patientID);

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
                tousername:  $scope.doctor.username,
                datetime: time.toString(),
                type : "offline",
                status : "unread"
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

    }]);