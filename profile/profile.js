'use strict';

angular.module('myApp.profile', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.html',
            controller: 'profileControll'
        });
    }])

    .controller('profileControll', ['$scope', '$rootScope', '$location', 'User', function ($scope, $rootScope, $location, User) {
        $scope.days = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];

        $scope.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
        ]

        $scope.years = [
            "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960",
        ]

        // setting the date of birth if the user already has data
        if (!$rootScope.isNullOrEmptyOrUndefined($rootScope.userObject.dob)) {
            //debugger
            var d = new Date($rootScope.userObject.dob);
            $scope.selectedDay = d.getDate().toString();
            $scope.selectedMonth = $scope.months[d.getMonth()];
            $scope.selectedYear = d.getFullYear().toString();
        }

        $scope.updating = false;
        $scope.updateProfileDetails = function (event) {

            if (!$rootScope.isNullOrEmptyOrUndefined($scope.selectedMonth) && !$rootScope.isNullOrEmptyOrUndefined($scope.selectedDay) && !$rootScope.isNullOrEmptyOrUndefined($scope.selectedYear)) {
                var d = new Date(parseInt($scope.selectedYear), $scope.months.indexOf($scope.selectedMonth), parseInt($scope.selectedDay));
                var dateofBirth = d.toString();
                $rootScope.userObject.dob = dateofBirth;
            }

            $scope.updating = true;
            var client = User.getClient();
            client.onComplete(function (data) {
                $scope.updating = false;
                $rootScope.displayMessage("Your profile has been successfully updated", "Success!", event);
            });
            client.onError(function (data) {
                $rootScope.displayMessage("Ops. There was an issue", "Error!", event);
                $scope.updating = false;
            });
            client.UpdateUserDetails($rootScope.userObject);
        };

        $scope.updatingPersonal = false;
        $scope.updatePersonalDetails = function (event) {

            $scope.updatingPersonal = true;
            var client = User.getClient();
            client.onComplete(function (data) {
                $scope.updatingPersonal = false;
                $rootScope.displayMessage("Your profile has been successfully updated", "Success!", event);
            });
            client.onError(function (data) {
                $rootScope.displayMessage("Ops. There was an issue", "Error!", event);
                $scope.updatingPersonal = false;
            });
            client.UpdateUserDetails($rootScope.userObject);
        };

        $scope.passUpdating = false;
        $scope.updatePassword = function (event) {
            debugger
            if (!$rootScope.isNullOrEmptyOrUndefined($scope.oldpassword) && !$rootScope.isNullOrEmptyOrUndefined($scope.newpassword)) {
                if ($scope.oldpassword === $scope.newpassword) {
                    $scope.passUpdating = true;
                    var client = User.getClient();
                    client.onComplete(function (data) {
                        $scope.passUpdating = false;
                        $rootScope.displayMessage("Your password has been updated. Enter the new password on the next signin.", "Success!", event);
                    });
                    client.onError(function (data) {
                        $rootScope.displayMessage("Ops. There was an issue", "Error!", event);
                        $scope.passUpdating = false;
                    });
                    client.UpdatePassword($scope.newpassword);
                } else {
                    $rootScope.displayMessage("Passwords you entered doesn't match.", "Opss!", event);
                    $scope.passUpdating = false;
                }
            } else {
                $rootScope.displayMessage("You must fill both of the fields to continue.", "Opss!", event);
                $scope.passUpdating = false;
            }
        }
    }]);