'use strict';

angular.module('myApp.chat', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/chat/:doctorID/:type', {
            templateUrl: 'chat/chat.html',
            controller: 'chatControl'
        });
    }])

    .controller('chatControl', ['$scope', '$rootScope', '$routeParams', 'User', 'ConnectionStorage', 'AppURLs', function ($scope, $rootScope, $routeParams, User, ConnectionStorage, AppURLs) {
        $rootScope.checkSession();

        $rootScope.connectionStatus = "Connecting...";
        var socket = io.connect(AppURLs.socketServer, { secure: true, port: 4000 });
        var peer;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        $scope.message = "";
        $scope.messagesList = [];
        console.log("User id:", $routeParams.doctorID);
        console.log("Type   :", $routeParams.type);

        var client = User.getClient();
        client.onComplete(function (data) {
            $scope.partner = data.object;
            socket.on('userconnected', function (username) {
                if (username == $scope.partner.username) {
                    $scope.$apply(function () {
                        if ($rootScope.connectionStatus != "Connected") {
                            socket.emit('connected', $rootScope.userObject.username);
                        }
                        $rootScope.connectionStatus = "Connected";
                    });
                }
            });
        });
        client.GetUserID($routeParams.doctorID);

        peer = $rootScope.getPeer();
        if (peer != null) {
            peer.on('error', function (err) {
                console.log(err);
                alert("Peer.On error app: " + err);
                $scope.endCall();
            })
            peer.on('call', function (call) {
                // Answer the call automatically (instead of prompting user) for demo purposes
                //$scope.step1();
                $scope.$apply(function () {
                    $scope.videochatText = "Video call with " + $scope.partner.name;
                });
                document.getElementById("call").style = "display:none";
                document.getElementById("endcall").style = "display:block";
                call.answer(window.localStream);
                //$scope.showVideoCall();
                $scope.step3(call);
            });
            peer.on('close', function (call) {
                $scope.endCall();
            });
            peer.on('disconnected', function (call) {
                $scope.endCall();
            });
        }

        //$scope.step3(peer);

        $scope.connect = function (c) {
            $rootScope.setPartnerPeerID(c.peer);
            //$scope.loading = "Connected";
            if (c.label == "chat") {
                c.on('data', function (data) {
                    $scope.addMessageToChatBox($scope.partner.name, data, "chat");
                });
                c.on('close', function () {
                    $scope.addMessageToChatBox("System", $scope.partner.name + ' has left the chat.', "chat");
                });
            } else if (c.label == "file") {
                c.on('data', function (data) {
                    // If we're getting a file, create a URL for it.
                    if (data.constructor === ArrayBuffer) {
                        var dataView = new Uint8Array(data);
                        var dataBlob = new Blob([dataView]);
                        var url = window.URL.createObjectURL(dataBlob);
                        $scope.addMessageToChatBox("System", url, "file");
                    }
                });
            }
        };

        $scope.connectFileShare = function (id) {
            var f = peer.connect(id, { label: 'file', reliable: true, metadata: $rootScope.userObject.id });
            f.on('open', function () {
                $rootScope.setFileDataConnection(f);
                $scope.connect(f);
            });
            f.on('error', function (err) {
                alert("File share connection error: " + err);
                console.log("File share connection error: " + err);
            });
        }

        if ($routeParams.type == "from") {
            // connect to doctor automatically.
            var conClient = new ConnectionStorage.getClient();
            conClient.onError(function (data) {
                console.log(data.message);
            });
            conClient.onComplete(function (data) {
                $scope.connectUser(data.value);
            });
            conClient.GetConnection($routeParams.doctorID);
        } else if ($routeParams.type == "to") {
            var datcon = $rootScope.getChatDataConnection();
            $scope.connect(datcon);

            /* var filcon = $rootScope.getFileDataConnection();
             if(filcon != null){
                 $scope.connect(filcon);
             }*/
            $scope.connectFileShare(datcon.peer);
        }



        $scope.connectUser = function (id) {
            $rootScope.setPartnerPeerID(id);
            var c = peer.connect(id, {
                label: 'chat',
                serialization: 'none',
                metadata: $rootScope.userObject.id
            });
            c.on('open', function () {
                $rootScope.setChatDataConnection(c);
                $scope.connect(c);
            });
            c.on('error', function (err) {
                $scope.$apply(function () {
                    $rootScope.connectionStatus = err;
                });
                console.log("Chat connection error: " + err);
                alert("Chat connection error: " + err);
            });

            $scope.connectFileShare(id);
            /*var f = peer.connect(id, { label: 'file', reliable: true });
            f.on('open', function () {
                $rootScope.setFileDataConnection(f);
                $scope.connect(f);
            });
            f.on('error', function (err) { alert(err); });*/
        }


        // end of connecting user

        $scope.step3 = function (call) {
            if (window.existingCall) {
                window.existingCall.close();
            }
            call.on('stream', function (stream) {
                var theirvideo = document.getElementById("theirvideo");
                theirvideo.setAttribute("src", URL.createObjectURL(stream));
            });
            window.existingCall = call;
            call.on('close', $scope.endCall);
        }

        $scope.endCall = function () {
            //peer.disconnect();
            //$scope.hideVideoCall();
            //$scope.videochatText="";
            var theirvideo = document.getElementById("theirvideo");
            theirvideo.setAttribute("src", null);
            document.getElementById("videoheadding").style = "display:none";
            document.getElementById("call").style = "display:block";
            document.getElementById("endcall").style = "display:none";
            window.existingCall.close();
            window.existingCall = null;
            /*window.localStream.stop();
            window.remoteStream.stop();*/
        }

        $scope.call = function () {
            $scope.videochatText = "Video call with " + $scope.partner.name;
            //$scope.step1();
            //$scope.showVideoCall();
            document.getElementById("videoheadding").style = "display:block";
            document.getElementById("call").style = "display:none";
            document.getElementById("endcall").style = "display:block";
            var id = $rootScope.getPartnerPeerID();
            var call = peer.call(id, window.localStream);
            $scope.step3(call);
        };

        $scope.step1 = function () {
            navigator.getUserMedia({ audio: true, video: true }, function (stream) {
                // Set your video displays
                var myvideo = document.getElementById("myvideo");
                myvideo.setAttribute("src", URL.createObjectURL(stream));
                window.localStream = stream;
                socket.emit('connected', $rootScope.userObject.username);
            }, function (err) {
                alert("There was an error binding video stream. Please check your webcam. Error: " + err);
                console.log("There was an error binding video stream. Please check your webcam. Error: " + err);
            });
        }
        $scope.step1();

        $scope.message = "";
        $scope.messagesList = [];

        $scope.addMessageToChatBox = function (by, message, type) {
            if (type == "chat") {
                var chatbubble = document.createElement("div");
                chatbubble.setAttribute("class", "chatbubble");
                chatbubble.innerHTML = "<b>" + by + "</b> &#0062;&#0062; " + message;

                var msgbox = document.getElementById("chatMessages");
                msgbox.appendChild(chatbubble);
            } else if (type == "file") {
                var chatbubble = document.createElement("div");
                chatbubble.setAttribute("class", "filebubble");
                chatbubble.innerHTML = "<b>" + by + "</b> &#0062;&#0062; You have recieved a <a target='_blank' href='" + message + "' download='ReceivedFile.jpg'>file</a>";
                //chatbubble.innerHTML = "<b>" + by + "</b> &#0062;&#0062; You have recieved a <a ng-click='downloadFile("+'"'+message+'"'+")')'>file</a>";  href='" + message + "'

                var msgbox = document.getElementById("chatMessages");
                msgbox.appendChild(chatbubble);
            } else if (type == "filesent") {
                var chatbubble = document.createElement("div");
                chatbubble.setAttribute("class", "filebubble");
                chatbubble.innerHTML = "<b>" + by + "</b> &#0062;&#0062; " + message;

                var msgbox = document.getElementById("chatMessages");
                msgbox.appendChild(chatbubble);
            }
        }

        $scope.addMessageToChatBox("System", "Your first conversation with this doctor.", "chat");
        //$scope.messagesList.push({ by: "System", message: "Your first conversation with this doctor." });

        $scope.sendMsg = function (message) {
            var peer_ID = $rootScope.getPartnerPeerID();
            var conns = peer.connections[peer_ID];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
                var conn = conns[i];
                if (conn.label === 'chat') {
                    if (conn.open) {
                        conn.send(message);
                    }
                }
            }
            /*var conn = $rootScope.getDataConnection();
            if (conn.open) {
                conn.send(message);
            }*/
            $scope.addMessageToChatBox("You", message, "chat");
            $scope.message = "";

        };

        $scope.downloadFile = function (url) {
            // Get file name from url.
            var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
                a.download = filename; // Set the file name.
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            xhr.open('GET', url);
            xhr.send();
        }



        $scope.sendFile = function (file) {
            //var peer = $rootScope.getPeer();
            var conns = peer.connections[$rootScope.getPartnerPeerID()];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
                var conn = conns[i];
                if (conn.label === 'file') {
                    if (conn.open) {
                        conn.send(file);
                    }
                }
            }
            $scope.addMessageToChatBox("System", "You send a file.", "filesent");
            $scope.message = "";

        };
        var chatbox = document.getElementById("messagebox");
        chatbox.onkeyup = function (e) {
            e = e || event;
            if (e.keyCode === 13) {
                $scope.sendMsg($scope.message);
                chatbox.value = "";
            }
            return true;
        }

        var box = $('#box');
        box.on('dragenter', doNothing);
        box.on('dragover', doNothing);
        box.on('drop', function (e) {
            e.originalEvent.preventDefault();
            var file = e.originalEvent.dataTransfer.files[0];
            $scope.sendFile(file);
        });
        function doNothing(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }]);