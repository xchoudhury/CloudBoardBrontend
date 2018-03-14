// Controller for function to update the user information
app.controller('update', ['$scope', '$http', function($scope, $http) {
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
            document.location.href = '/';
        });
    };

    $scope.initialize();

    $scope.updateUsername = function() {
        $('#passwordError').html("");
        if ($scope.userPassword === "") {
            $('#passwordError').html("Your password is required for this");
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
            $('#usernameAlert').show();
            setTimeout(function() {
                $('#usernameAlert').fadeOut(300);
            }, 3000);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.updateEmail = function() {
        $http({
            method: 'PATCH',
            url: '/auth/me/',
            data: {
                //id: $scope.userID,
                email: $scope.email
            }
        }).then(function successCallback(response) {
            console.log(response);
            $('#emailAlert').show();
            setTimeout(function() {
                $('#emailAlert').fadeOut(300);
            }, 3000);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.updatePassword = function() {
        if (!($scope.userNewPassword === $scope.confirmNewPassword)) {
            $('#confirmPasswordError').html("Passwords do not match");
            return;
        }
        $http({
            method: 'POST',
            url: '/auth/password/',
            data: {
                new_password: $scope.userNewPassword,
                current_password: $scope.userPassword
            }
        }).then(function successCallback(response) {
            console.log(response);
            $('#passwordAlert').show();
            setTimeout(function() {
                $('#passwordAlert').fadeOut(300);
            }, 3000);
        }, function errorCallback(response) {
            console.log(response);
        });
    };
}]);