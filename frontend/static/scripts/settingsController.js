// Settings controller, contains all functions to be called from settings panel
app.controller('settings', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
    $scope.settingsVisible = false;
  
    // Show settings panel on click
    $scope.toggle = function() {
      if (!$scope.settingsVisible) {
        $scope.settingsVisible = true;
        $('.settingsPanel').show();
        $('.settingsPanel').width("150px");
      }
      else {
        $scope.settingsVisible = false;
        $('.settingsPanel').width("0");
        setTimeout(function () {
          $('.settingsPanel').hide();
        }, 200);
      }
      $('#dimmer').toggle();
    };
  
    $scope.logOut = function() {
      $http({
        method: 'POST',
        url: '/api-auth/logout/'
      }).then(function successCallback() {
        console.log('logout successful');
      }, function errorCallback(response) {
        console.log('logout unsuccesful');
        console.log(response);
      });
      $scope.toggle();
      $('#dimmer').show();
      loginService.logOut();
    }
  }]);