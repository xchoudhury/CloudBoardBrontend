// Login service, passes login functions between login controller and boards controller to manage user info such as getting user name
app.factory('loginService', ['$rootScope', '$http', function($rootScope, $http) {
    var loggedIn;
    var user;
  
    var logOut = function() {
      // Fire loggingOut signal so other controllers can update when logged out
      $rootScope.$broadcast('loggingOut'); 
    };
  
    var getLoginStatus = function() {
      $http({
        method: 'GET',
        url: '/auth/me/'
      }).then(function successCallback(response) {
        loggedIn = true;
        user = response.data.username;
        console.log(response);
        $rootScope.$broadcast('loggingIn');
      }, function errorCallback(response) {
        loggedIn = false;
        user = "";
        console.log(response);
        $('.loader').hide();
        $('#loginFrom').show();
        $rootScope.$broadcast('loggingOut');
      });
      return loggedIn;
    };
  
    var getUserName = function() {
      return user;
    }
  
    return {
      logOut: logOut,
      getLoginStatus: getLoginStatus,
      getUserName: getUserName
    };
  }]);