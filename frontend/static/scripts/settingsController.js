// Settings controller, contains all functions to be called from settings panel
app.controller('settings', ['$scope', '$http', '$rootScope', 'loginService', function($scope, $http, $rootScope, loginService) {
    $scope.settingsVisible = false;
  
    // Show settings panel on click
    $scope.toggle = function() {
      if (!$scope.settingsVisible) {
        if ($('#dimmer').is(":visible")) {
          // Do not show settings if dimmer is visibile
          return;
        }
        $scope.settingsVisible = true;
        $('.settingsPanel').show();
        $('.settingsPanel').width("200px");
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
        console.log(response);
        alertError('Error: Could not log out. Response status ' + response.status + '.');
      });
      $scope.toggle();
      $('#dimmer').show();
      loginService.logOut();
    };

    $scope.goToFAQ = function() {
      $rootScope.view = 'faq';
      $scope.toggle();
    };
    
    $scope.goToAccount = function() {
      $rootScope.view = 'account';
      $scope.toggle();
    };
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

