// Controller for function to update the user information
app.controller('update', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
    $scope.userID;
    $scope.userName;
    $scope.userEmail;
    $scope.userPassword = "";
    $scope.userNewPassword;
    $scope.confirmNewPassword;

    $scope.initialize = function() {
        $http({
            method: 'GET',
            url: '/auth/me/'
        }).then(function successCallback(response) {
            console.log(response);
            $scope.userID = response.data.id;
            $scope.userName = response.data.username;
            $scope.userEmail = response.data.email;
        }, function errorCallback(response) {
            console.log(response);
            //document.location.href = '/';
        });
    };

    $scope.initialize();

    $scope.$on('loggingIn', function() {
        $scope.initialize();
    });

    $scope.updateUsername = function() {
        $('#currentPasswordError').html("");
        $('#updateUsernameError').html("");
        if ($scope.userPassword === "") {
            $('#currentPasswordError').html("Your password is required for this");
            return;
        }
        $http({
            method: 'POST',
            url: '/auth/username/',
            data: {
                current_password: $scope.userPassword,
                new_username: $scope.userName
            }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.userPassword = "";
            loginService.updateUserName($scope.userName);
            $('#usernameAlert').show();
            setTimeout(function() {
                $('#usernameAlert').fadeOut(300);
            }, 3000);
        }, function errorCallback(response) {
            printErrors(response.data.new_username, 'updateUsernameError');
            printErrors(response.data.current_password, 'currentPasswordError');
            console.log(response);
        });
    };

    $scope.updateEmail = function() {
        $('#updateEmailError').html("");
        $http({
            method: 'PUT',
            url: '/auth/me/',
            data: {
                //id: $scope.userID,
                email: $scope.userEmail
            }
        }).then(function successCallback(response) {
            console.log(response);
            $('#emailAlert').show();
            setTimeout(function() {
                $('#emailAlert').fadeOut(300);
            }, 3000);
        }, function errorCallback(response) {
            console.log(response);
            printErrors(response.data.email, 'updateEmailError');
        });
    };

    $scope.updatePassword = function() {
        $('#confirmPasswordError').html("");
        $('#newPasswordError').html("");
        $('#currentPasswordError').html("");
        if (!($scope.userNewPassword === $scope.confirmNewPassword)) {
            $('#confirmPasswordError').html("Passwords do not match");
            return;
        }
        $http({
            method: 'POST',
            url: '/auth/password/',
            data: {
                new_password: $scope.userNewPassword,
                re_new_password: $scope.confirmNewPassword,
                current_password: $scope.userPassword
            }
        }).then(function successCallback(response) {
            console.log(response);
            $('#passwordAlert').show();
            setTimeout(function() {
                $('#passwordAlert').fadeOut(300);
            }, 3000);
            $scope.userPassword = "";
            $scope.userNewPassword = "";
            $scope.confirmNewPassword = "";
        }, function errorCallback(response) {
            console.log(response);
            printErrors(response.data.new_password, 'newPasswordError');
            printErrors(response.data.re_new_password, 'confirmPasswordError');
            printErrors(response.data.current_password, 'currentPasswordError');
        });
    };
}]);