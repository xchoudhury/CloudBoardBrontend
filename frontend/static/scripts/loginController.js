// Login controller, has control over the mini form displayed when not logged in
app.controller('login', ['$scope', '$http', '$location', 'loginService', function($scope, $http, $location, loginService) {
    $scope.loggedIn = loginService.getLoginStatus();
    $scope.username;
    $scope.password;
    $scope.email;
    $scope.creatingAccount = false;
    $scope.accountCreated = false;
    $scope.forgettingPassword = false;
  
    $scope.$on('loggingOut', function() { // Clear old data on logging out signal
      $scope.loggedIn = false;
      $scope.username = "";
      $scope.password = "";
      $('.loader').hide();
      $('#loginForm').show();
    });
  
    $scope.$on('loggingIn', function() {
      $scope.loggedIn = true;
      $scope.username = "";
      $scope.password = "";
    })
  
    // Log in when the user hits enter on the password textbox
    $scope.keyCheck = function(e) {
      if (e.keyCode == 13) {
        $scope.logIn();
      }
    }

    $scope.checkForRedirect = function() {
      if ($location.path().indexOf('/api-auth/login') > -1) {
        // Wrong login redirect
        console.log($location.path());
        $('#usernameError').html("The username and password do not match");
      };
    };

    $scope.checkForRedirect();
  
    // Login function
    $scope.logIn = function() {
      var form = $("#loginForm");
      form.submit();
    };
  
    $scope.logOut = function() {
      loginService.logOut();
    };
  
    $scope.createAccount = function() {
      if (!$scope.creatingAccount) {
        // First click
        $scope.creatingAccount = true;
      }
      else {
        // Second click
        $('#usernameError').html("");
        $('#passwordError').html("");
        $('#emailError').html("");
        $http({
          method: 'POST',
          url: '/auth/users/create/',
          data: {
            email: $scope.email,
            username: $scope.username,
            password: $scope.password
          }
        }).then(function successCallback(response) {
          console.log(response);
          $scope.accountCreated = true;
          $scope.creatingAccount = false;
        }, function errorCallback(response) {
          console.log(response);
          printErrors(response.data.username, 'usernameError');
          printErrors(response.data.password, 'passwordError');
          printErrors(response.data.email, 'emailError');
        });
      }
    };
  
    $scope.forgotPassword = function() {
      if (!$scope.forgettingPassword) {
        // First click
        $scope.forgettingPassword = true;
        $scope.creatingAccount = true;
        $scope.accountCreated = true;
        $('form').hide();
      }
      else {
        $('#emailError').html("");
        if (!$scope.email) {
          $('#emailError').html("Email is required");
          return;
        }
        $http({
          method: 'POST',
          url: '/auth/password/reset/',
          data: {
            email: $scope.email
          }
        }).then(function successCallback(response) {
          console.log(response);
          $('#resetModal').modal('show');
          $scope.forgettingPassword = false;
          $scope.creatingAccount = false;
          $scope.accountCreated = false;
          $('form').show();
        }, function errorCallback(response) {
          console.log(response);
        });
      }
    };
  }]);