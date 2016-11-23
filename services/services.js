'use strict';

angular.module('myApp.Services', []).
    factory('User', ['$rootScope', 'ConnectionStorage', 'AppURLs', 'PeerService', function ($rootScope, ConnectionStorage, AppURLs, PeerService) {

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
                    document.cookie = name + "=" + value + expires;
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

                console.log("DEBUG : CheckSession - " + securityToken);
                console.log("DEBUG : sessionInfo - " + sessionInfo);
                console.log("DEBUG : userName - " + userName);

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

            return {
                checkSession: function () {
                    return checksession();
                },
                getSession: function () {
                    return getsession();
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
                    status: "available",
                    type: "doctor",
                    country: "Sri Lanka",
                    city: "Colombo",
                    languages: ["English", "Indonesian"],
                    profileimage: "http://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c",
                    peer: {},
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
                    status: "maybe",
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
                    status: "available",
                    type: "doctor",
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

            function authUser(username, password) {
                var ResultObj = {};
                var resultFound = false;
                var count = 0;
                if (angular.isDefined(username) && angular.isDefined(password)) {
                    if (username != "" && password != "") {
                        angular.forEach(doctors, function (userObject, index) {
                            if (userObject.username == username && userObject.password == password) {

                                resultFound = true;
                                var conclient = ConnectionStorage.getClient();

                                var peerClient = PeerService.getClient();
                                peerClient.onComplete(function (peer) {
                                    console.log("Success: " + peer);
                                    conclient.onComplete(function (data) {
                                        console.log(data);
                                    });
                                    conclient.onError(function (data) {
                                        console.log(data);
                                    });
                                    console.log('Key:', userObject.id);
                                    console.log('Value:', peer.id);
                                    conclient.SetConnection(userObject.id, peer.id);

                                    userObject.peer = peer;
                                    currentUser = userObject;
                                    userObject.status = "available";
                                    $rootScope.username = username;
                                    $rootScope.userObject = userObject;
                                    $rootScope.setPeer(peer);
                                    ResultObj = {
                                        status: resultFound,
                                        message: "Login successful",
                                        user: userObject
                                    };
                                    console.log("My ID: ", peer.id);
                                    // testing socket.io functionality
                                    var socket = io.connect(AppURLs.socketServer, { secure: true, port: 4000 });
                                    socket.on('connect', function (data) {
                                        socket.emit('online', userObject.username);
                                    });
                                    if (onComplete) onComplete(ResultObj);
                                });
                                peerClient.onError(function (data) {
                                    console.log("Error: " + data);
                                    ResultObj = {
                                        status: resultFound,
                                        message: data,
                                        user: {}
                                    };
                                    if (onError) onError(ResultObj)
                                });
                                peerClient.GeneratePeer();
                            }
                            count++;
                            if (doctors.length == count) {
                                if (!resultFound) {
                                    ResultObj = {
                                        status: resultFound,
                                        message: "Invalid username or password. Please try again",
                                        user: {}
                                    };
                                    if (onError) onError(ResultObj)
                                }
                            }
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
                doctors.forEach(function (doctor) {
                    if (doctor.id == id) {
                        doctorObject = doctor;
                        recordFound = true;
                        message = "Record found!";
                        if (onComplete) onComplete({ status: recordFound, object: doctorObject, message: message });
                    }
                }, this);
                if (!recordFound) {
                    message = "Record not found.";
                }
                if (onError) onError({ status: recordFound, object: doctorObject, message: message });
            }

            function getalldocs() {
                var returnList = [];
                doctors.forEach(function (doctor) {
                    if (doctor.type == "doctor") {
                        returnList.push(doctor);
                    }
                }, this);
                if (onComplete) onComplete(returnList);
            }

            function setCurrentuser(user) {
                currentUser = user;
            }

            function setUserOnline(username) {

            }

            function setUserOffline(username) {

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
    factory('PeerService', ['$rootScope', '$http', 'IDService', function ($rootScope, $http, IDService) {
        function PeerClient(params) {
            var onComplete;
            var onError;

            function genPeer() {
                var URL = "https://service.xirsys.com/ice";
                var body = {
                    ident: "tistuslabs",
                    secret: "1fa0fdd8-09f0-11e6-97f8-4b76c213acdb",
                    domain: "prepaid.topas.tv",
                    application: "default",
                    room: "default",
                    secure: 1
                };
                $http.post(URL, body).
                    success(function (data, status, headers, config) {
                        var id = IDService.generateID();
                        var peer = new Peer(id, {
                            host: 'prepaid.topas.tv',
                            port: 9000,
                            path: '/peerjs',
                            secure: true,
                            debug: 3,
                            logFunction: function () {
                                var copy = Array.prototype.slice.call(arguments).join(' ');
                                console.log(copy);
                            },
                            config: data.d
                        });
                        // when the peer is connected successfully
                        peer.on('open', function (id) {
                            if (onComplete) onComplete(peer);
                        });
                        peer.on('error', function (err) {
                            if (onError) onError(peer)
                        })
                    }).
                    error(function (data, status, headers, config) {
                        if (onError) onError(data);
                    });

            }

            return {
                GeneratePeer: function () {
                    genPeer();
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
                var req = new PeerClient();
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
            "DataStorage": p + "//" + "localhost" + ":3000"
        }
    });