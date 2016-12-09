'use strict';

angular.module('myApp.Services', []).
    factory('User', ['$rootScope', 'ConnectionStorage', 'AppURLs', 'TokboxService', '$http', function ($rootScope, ConnectionStorage, AppURLs, TokboxService, $http) {

        function AuthClient() {

            var sessionInfo;
            var userName;
            var securityToken;

            var _cookMan = (function () {
                function createCookie(name, value, days) {
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                    } else var expires = "";
                    var Cpath = '; path=/'
                    document.cookie = name + "=" + value + expires + Cpath;
                }

                return {
                    set: function (name, value, days) {
                        createCookie(name, value, days);
                    },
                    get: function (name) {
                        var nameEQ = name + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                        }
                        return null;
                    },
                    delete: function (name) {
                        createCookie(name, "", -1);
                    }
                };
            })();

            function checksession() {
                securityToken = _cookMan.get("securityToken");
                sessionInfo = _cookMan.get("authData");

                if (sessionInfo) {
                    sessionInfo = JSON.parse(decodeURIComponent(sessionInfo));
                    userName = sessionInfo.username;
                }

                console.log("CheckSession - " + securityToken);
                console.log("sessionInfo - " + sessionInfo);
                console.log("userName - " + userName);

                if (securityToken == null) {
                    var nagivateUrl = "";
                    if (location.host == "localhost") {
                        nagivateUrl = "/dokter.id/auth";
                    } else {
                        nagivateUrl = "/dokter.id/auth";
                    }
                    location.href = nagivateUrl;
                }

                return securityToken;
            }

            function getsession() {
                sessionInfo = _cookMan.get("authData");
                if (sessionInfo) {
                    sessionInfo = JSON.parse(decodeURIComponent(sessionInfo));
                    userName = sessionInfo.Username;
                }
                return sessionInfo;
            }

            function getTokboxsession() {
                var sessionInfo = {};
                sessionInfo.apiKey = _cookMan.get("apiKey");
                sessionInfo.sessionId = _cookMan.get("sessionId");
                sessionInfo.token = _cookMan.get("token");
                return sessionInfo;
            }

            function signout() {
                _cookMan.delete("securityToken");
                _cookMan.delete("authData");
                _cookMan.delete("apiKey");
                _cookMan.delete("sessionId");
                _cookMan.delete("token");
            }

            function setsession(securityToken, authData, session) {
                _cookMan.set("securityToken", securityToken, 1);
                _cookMan.set("authData", JSON.stringify(authData), 1);
                _cookMan.set("apiKey", session.apiKey, 1);
                _cookMan.set("sessionId", session.sessionId, 1);
                _cookMan.set("token", session.token, 1);
            }

            return {
                checkSession: function () {
                    return checksession();
                },
                getSession: function () {
                    return getsession();
                },
                getTokSession: function () {
                    return getTokboxsession();
                },
                setSession: function (securityToken, authData, apiKey, sessionId, token) {
                    return setsession(securityToken, authData, apiKey, sessionId, token);
                },
                signOut: function () {
                    return signout();
                }
            };
        }

        function UserClient() {
            var onComplete;
            var onError;

            var currentUser;
            var doctors = [
                {
                    id: "1",
                    name: "Shehan Tissera",
                    username: 'shehan@gmail.com',
                    password: 'shehan',
                    status: "unavailable",
                    type: "doctor",
                    country: "Sri Lanka",
                    city: "Colombo",
                    languages: ["English", "Indonesian"],
                    profileimage: "https://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c",
                    otherdata: {
                        speciality: "Specialist in Angular",
                        currency: "USD",
                        rate: "50",
                        shortbiography: "Pationate in whatever the task is.",
                        awards: "1st place in all places",
                        graduateschool: "Cardif Metropolitan",
                        residenceplace: "Colombo"
                    }
                },
                {
                    id: "2",
                    name: "Danushka",
                    username: 'danushka@gmail.com',
                    password: 'danushka',
                    status: "unavailable",
                    type: "doctor",
                    country: "Sri Lanka",
                    city: "Colombo",
                    languages: ["English", "Indonesian"],
                    profileimage: "",
                    peer: {},
                    otherdata: {
                        speciality: "Specialist in Nuro",
                        currency: "IDR",
                        rate: "1700",
                        shortbiography: "Pationate in whatever the task is.",
                        awards: "1st place in all places",
                        graduateschool: "Cardif Metropolitan",
                        residenceplace: "Colombo"
                    }
                },
                {
                    id: "3",
                    name: "Russel Peters",
                    username: 'russel@gmail.com',
                    password: 'russel',
                    status: "unavailable",
                    type: "doctor",
                    country: "India",
                    city: "Mombai",
                    languages: ["English", "Indonesian"],
                    profileimage: "",
                    peer: {},
                    otherdata: {
                        speciality: "Specialist in Nuro",
                        currency: "IDR",
                        rate: "8970",
                        shortbiography: "Pationate in whatever the task is.",
                        awards: "1st place in all places",
                        graduateschool: "Cardif Metropolitan",
                        residenceplace: "Colombo"
                    }
                },
                {
                    id: "5",
                    name: "Eshwaran Weerabahu",
                    username: 'eash@gmail.com',
                    password: 'eash',
                    status: "unavailable",
                    type: "patient",
                    country: "Sri Lanka",
                    city: "Mombai",
                    languages: ["English", "Indonesian"],
                    profileimage: "",
                    peer: {},
                    otherdata: {
                        speciality: "Specialist in Nuro",
                        currency: "IDR",
                        rate: "8970",
                        shortbiography: "Pationate in whatever the task is.",
                        awards: "1st place in all places",
                        graduateschool: "Cardif Metropolitan",
                        residenceplace: "Colombo"
                    }
                },
                {
                    id: "4",
                    name: "John Cena",
                    username: 'john@gmail.com',
                    password: 'john',
                    speciality: "",
                    status: "unavailable",
                    type: "patient",
                    country: "Sri Lanka",
                    city: "Kelaniya",
                    languages: ["English", "Indonesian"],
                    profileimage: "",
                    peer: {},
                    otherdata: {}
                }
            ];

            function getNewProfile() {
                var obj = {
                    name: "",
                    username: '',
                    password: '',
                    status: "unavailable",
                    type: "",
                    country: "",
                    city: "",
                    dob:"",
                    languages: [],
                    profileimage: "",
                    otherdata: {
                        speciality: "",
                        currency: "",
                        rate: "",
                        shortbiography: "",
                        awards: "",
                        graduateschool: "",
                        residenceplace: ""
                    }
                }
                return obj;
            }

            function authUser(username, password) {
                var ResultObj = {};
                var resultFound = false;
                var count = 0;
                if (angular.isDefined(username) && angular.isDefined(password)) {
                    if (username != "" && password != "") {

                        var URL = "../apis/?action=authenticate_user&email=" + username + "&password=" + password;
                        $http.get(URL).
                            success(function (data, status, headers, config) {
                                //debugger;
                                if (data.IsSuccess) {

                                    var userObject = data.Data;

                                    resultFound = true;
                                    var conclient = ConnectionStorage.getClient();

                                    var tokClient = TokboxService.getClient();
                                    tokClient.onComplete(function (session) {
                                        console.log("Success: " + session);
                                        conclient.onComplete(function (data) {
                                            console.log(data);
                                        });
                                        conclient.onError(function (data) {
                                            console.log(data);
                                        });
                                        console.log('Key:', userObject._id);
                                        console.log('Value:', session.sessionId);
                                        conclient.SetConnection(userObject._id, session.sessionId);

                                        currentUser = userObject;
                                        userObject.status = "available";
                                        $rootScope.username = username;
                                        $rootScope.userObject = userObject;
                                        //$rootScope.setTokSession(session);
                                        ResultObj = {
                                            status: resultFound,
                                            message: "Login successful",
                                            user: userObject
                                        };
                                        console.log("My ID: ", session.sessionId);
                                        // testing socket.io functionality
                                        //var socket = io.connect(AppURLs.socketServer, { secure: true, port: 4001 });

                                        var client = new AuthClient();
                                        client.setSession(session.sessionId, userObject, session);

                                        if (onComplete) onComplete(ResultObj);
                                    });
                                    tokClient.onError(function (data) {
                                        console.log("Error: " + data);
                                        ResultObj = {
                                            status: resultFound,
                                            message: data,
                                            user: {}
                                        };
                                        if (onError) onError(ResultObj)
                                    });
                                    tokClient.GenerateSession();

                                } else {
                                    ResultObj = {
                                        status: resultFound,
                                        message: "Invalid username or password. Please try again",
                                        user: {}
                                    };
                                    if (onError) onError(ResultObj)
                                }
                            }).
                            error(function (data, status, headers, config) {
                                ResultObj = {
                                    status: resultFound,
                                    message: "Invalid username or password. Please try again",
                                    user: {}
                                };
                                if (onError) onError(ResultObj)
                            });
                    } else {
                        ResultObj = {
                            status: resultFound,
                            message: "Username or Password cannot be empty.",
                            user: {}
                        };
                        if (onError) onError(ResultObj)
                    }
                } else {
                    ResultObj = {
                        status: resultFound,
                        message: "Username or Password cannot be empty.",
                        user: {}
                    };
                    if (onError) onError(ResultObj)
                }
            }

            function getUserID(id) {
                var recordFound = false;
                var doctorObject = {};
                var message = "";

                $http.get(AppURLs.APIUrl + '/users/' + id).
                    success(function (data, status, headers, config) {
                        if (data._id == id) {
                            doctorObject = data;
                            recordFound = true;
                            message = "Record found!";
                            if (onComplete) onComplete({ status: recordFound, object: doctorObject, message: message });
                        }
                    }).
                    error(function (data, status, headers, config) {
                        if (!recordFound) {
                            message = "Record not found.";
                        }
                        if (onError) onError({ status: recordFound, object: doctorObject, message: message });
                    });
            }

            function getalldocs() {
                var returnList = [];
                $http.get(AppURLs.APIUrl + '/users').
                    success(function (data, status, headers, config) {
                        data.forEach(function (doctor) {
                            if (doctor.type == "doctor") {
                                returnList.push(doctor);
                            }
                        }, this);
                        if (onComplete) onComplete(returnList);
                    }).
                    error(function (data, status, headers, config) {
                        if (onError) onError(data);
                    });
            }

            function setCurrentuser(user) {
                currentUser = user;
            }

            function setUserOnline(username) {

            }

            function setUserOffline(username) {

            }

            function regUser(profile) {
                var profileObject = getNewProfile();
                profileObject.name = profile.name;
                profileObject.username = profile.username;
                profileObject.password = profile.password;
                profileObject.type = profile.type;

                $http.post(AppURLs.APIUrl + '/users', profileObject)
                    .success(function (data, status, headers, config) {
                        if (onComplete) onComplete({ status: true, object: null, message: data });
                    })
                    .error(function (data, status, header, config) {
                        if (onError) onError({ status: false, object: doctorObject, message: data });
                    });
            }

            function getCurrentUser() {
                if (onComplete) onComplete(currentUser);
                if (onError) onComplete(null);
            }

            return {
                SetUserOnline: function (user) {
                    doctors.forEach(function (doctor) {
                        if (doctor.username == user) {
                            doctor.status = "Online";
                        }
                    }, this);
                },
                SetUserOffline: function (user) {
                    doctors.forEach(function (doctor) {
                        if (doctor.username == user) {
                            doctor.status = "Offine";
                        }
                    }, this);
                },
                SetCurrentUser: function (user) {
                    setCurrentuser(user)
                    return this;
                },
                GetCurrentUser: function () {
                    getCurrentUser();
                    return this;
                },
                GetAllDoctors: function () {
                    getalldocs();
                    return this;
                },
                GetUserID: function (id) {
                    getUserID(id);
                    return this;
                },
                AuthenticateUser: function (username, password) {
                    authUser(username, password)
                    return this;
                },
                RegisterUser: function (profile) {
                    regUser(profile)
                    return this;
                },
                onComplete: function (func) {
                    onComplete = func;
                    return this;
                },
                onError: function (func) {
                    onError = func;
                    return this;
                }
            }
        }

        return {
            getClient: function () {
                var req = new UserClient();
                return req;
            },
            getAuthClient: function () {
                var req = new AuthClient();
                return req;
            },
        }

    }]).
    factory('TokboxService', ['$rootScope', '$http', 'IDService', function ($rootScope, $http, IDService) {
        function TokboxClient(params) {
            var onComplete;
            var onError;

            var apiKey,
                sessionId,
                token;

            function genSession() {
                var URL = SERVER_BASE_URL + '/session';
                $http.get(URL).
                    success(function (data, status, headers, config) {
                        var id = IDService.generateID();
                        apiKey = data.apiKey;
                        sessionId = data.sessionId;
                        token = data.token;

                        var data = {
                            apiKey: apiKey,
                            sessionId: sessionId,
                            token: token
                        }
                        if (onComplete) onComplete(data);
                        //initializeSession(apiKey,sessionId,data);
                    }).
                    error(function (data, status, headers, config) {
                        if (onError) onError(data);
                    });
            }

            function initializeSession(apiKey, sessionId, data) {
                var session = OT.initSession(apiKey, sessionId);

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
                session.connect(token, function (error) {
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
            }

            return {
                GenerateSession: function () {
                    genSession();
                    return this;
                },
                onComplete: function (func) {
                    onComplete = func;
                    return this;
                },
                onError: function (func) {
                    onError = func;
                    return this;
                }
            }
        }
        return {
            getClient: function () {
                var req = new TokboxClient();
                return req;
            }
        }
    }]).
    factory('ConnectionStorage', ['$rootScope', 'AppURLs', '$http', function ($rootScope, AppURLs, $http) {
        function ConnectionClient() {
            var onComplete;
            var onError;

            function getConnection(key) {
                var URL = AppURLs.connectionStorage + '/connection/get'
                console.log(URL);
                $http.post(URL, { "key": key }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).
                    success(function (data, status, headers, config) {
                        if (onComplete) onComplete(data);
                    }).
                    error(function (data, status, headers, config) {
                        if (onError) onError(data);
                    });
            }
            function setConnection(key, value) {
                var URL = AppURLs.connectionStorage + '/connection/set'
                console.log(URL);
                $http.post(URL, { "key": key, "value": value }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).
                    success(function (data, status, headers, config) {
                        if (onComplete) onComplete(data);
                    }).
                    error(function (data, status, headers, config) {
                        if (onError) onError(data);
                    });
            }
            return {
                GetConnection: function (key) {
                    getConnection(key);
                    return this;
                },
                SetConnection: function (key, conn) {
                    setConnection(key, conn)
                    return this;
                },
                onComplete: function (func) {
                    onComplete = func;
                    return this;
                },
                onError: function (func) {
                    onError = func;
                    return this;
                }
            }
        }
        return {
            getClient: function () {
                var req = new ConnectionClient();
                return req;
            }
        }
    }]).
    service('IDService', function ($rootScope) {
        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        this.generateID = function () {
            return makeid();
        };
    }).
    factory('AppURLs', function ($rootScope) {
        //var p = location.protocol;
        var p = "https:";
        return {
            "connectionStorage": p + "//" + "prepaid.topas.tv" + ":4001",
            "socketServer": p + "//" + "prepaid.topas.tv" + ":4001",
            "DataStorage": p + "//" + "localhost" + ":3000",
            "APIUrl": "http://103.242.180.213:3000/api"
        }
    });