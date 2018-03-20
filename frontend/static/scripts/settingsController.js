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

function colorChange(color) {
  //console.log(color);
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);
  //console.log(R + ' ' + G + ' ' + B);
  var newColor = "rgb("+R+", "+G+", "+B+")";
  $('.navbar').css('background-color', newColor);
}

function invert(checkboxElement) {
  if (checkboxElement.checked) {
    document.body.className = "inverted";
  }
  else {
    document.body.className = "normal";
  }
}