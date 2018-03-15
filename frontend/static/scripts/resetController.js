app.controller('reset', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.newPass;
    $scope.confirmPass;
    $scope.uid = $location.search().uid;
    $scope.token = $location.search().token;
  
    $scope.resetPassword = function() {
      $('#newPasswordError').html("");
      $('#confirmPasswordError').html("");
      if (!($scope.newPass === $scope.confirmPass)) {
        $('#confirmPasswordError').html("Passwords do not match");
        return;
      }
      $http({
        method: 'POST',
        url: '/auth/password/reset/confirm/',
        data: {
          uid: $scope.uid,
          token: $scope.token,
          new_password: $scope.newPass,
          re_new_password: $scope.confirmPass
        }
      }).then(function successCallback(response) {
        console.log(response);
        document.location.href = "/";
      }, function errorCallback(response) {
        console.log(response);
        printErrors(response.data.new_password, 'newPasswordError');
        printErrors(response.data.re_new_password, 'confirmPasswordError');
        if (typeof response.data.uid != 'undefined') {
          $('#uidError').append("You have recieved an invalid uid. Request a new reset password link");
        }
        if (typeof response.data.token != 'undefined') {
          $('#tokenError').append("You have recieved an invalid token. Request a new reset password link");
        }
      });
    }
  }]);