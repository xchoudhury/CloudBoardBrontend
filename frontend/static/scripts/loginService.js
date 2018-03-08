// Login service, passes login functions between login controller and boards controller to manage user info such as getting user name
app.factory('loginService', ['$rootScope', '$http', '$cookies', '$cookieStore', function($rootScope, $http, $cookies, $cookieStore) {
    var loggedIn;
    var user;
  
    var logIn = function(username, password) {
      loggedIn = true;
      /*
      $http({
        method: 'POST',
        url: 'https://cloudboardbackend.herokuapp.com/api-auth/login/',
        data: {
          username: 'root',
          password: 'admin'
        }
      }).then(function successCallback(response) {
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
      */
      user = username;
      $cookieStore.put("loggedIn", "true");
      $cookieStore.put("user", username);
      $rootScope.$broadcast('loggingIn'); // Fire loggingIn signal so other controllers can update when logged in
    };
  
    var logOut = function() {
      loggedIn = false;
      user = "";
      $cookieStore.put("loggedIn", false);
      $rootScope.$broadcast('loggingOut'); // Fire loggingOut signal so other controllers can update when logged out
    };
  
    var getLoginStatus = function() {
      console.log(document.cookie);
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
      //if ($cookieStore.get("loggedIn")) {
      //  loggedIn = true;
      //}
      console.log(loggedIn);
      return loggedIn;
    };
  
    var getUserName = function() {
      //return $cookieStore.get("user");
      return user;
    }
  
    return {
      logIn: logIn,
      logOut: logOut,
      getLoginStatus: getLoginStatus,
      getUserName: getUserName
    };
  }]);