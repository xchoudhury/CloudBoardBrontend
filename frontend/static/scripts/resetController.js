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
        if (typeof response.data.new_password != 'undefined') {
          for (var i = 0; i < response.data.new_password.length; i++) {
            $('#newPasswordError').append(response.data.new_password[i] + '<br />');
          }
        }
        if (typeof response.data.re_new_password != 'undefined') {
          for (var i = 0; i < response.data.re_new_password.length; i++) {
            $('#confirmPasswordError').append(response.data.re_new_password[i] + '<br />');
          }
        }
        if (typeof response.data.uid != 'undefined') {
          $('#uidError').append("You have recieved an invalid uid. Request a new reset password link");
        }
        if (typeof response.data.token != 'undefined') {
          $('#tokenError').append("You have recieved an invalid token. Request a new reset password link");
        }
      });
    }
  }]);