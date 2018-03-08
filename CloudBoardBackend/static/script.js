// Board object constructor
function Board(id, hasContent, preview, content) {
  this.id = id;
  this.hasContent = hasContent;
  this.preview = preview;
  this.content = content;
  this.pasting = false;
}

// URL parameter function

var app = angular.module('CloudBoard', ['ngCookies', 'ngRoute']);

// New interpolation symbols, uses [[ ]] instead of {{ }}
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.config(function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

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

// Boards controller, has main control over the functions that directly affect the board data
app.controller('boards', ['$scope', '$http', '$window', 'loginService', function($scope, $http, $window, loginService) {
  $scope.loggedIn;
  $scope.name;

  $scope.boards = []; // This array variable will store all the boards and their info

  $scope.$on('loggingIn', function() { // Get updated user info when loginService sends loggingIn signal
    $scope.loggedIn = true;
    $scope.name = loginService.getUserName();
    $scope.getBoards();
    $('#dimmer').hide();
  });

  $scope.$on('loggingOut', function() { // Clear boards when the user logs out
    $scope.loggedIn = false;
    $scope.name = loginService.getUserName();
    $scope.getBlankBoards();
  })

  // Create a board from passed in content
  $scope.createBoard = function(content) {
    var board = new Board($scope.boards.length+1, true, $scope.filterPreview(content), content);
    $scope.boards.push(board);
  }

  // Creates the basic board with "some sample text" for testing purposes
  $scope.createBasicBoard = function() { 
    var basicBoard = new Board($scope.boards.length+1, true, "some sample text", "some sample text");
    $scope.boards.push(basicBoard);
  };

  // Creates a blank board and adds it to the end of the boards arrays
  $scope.createBlankBoard = function() {
    var blankBoard = new Board($scope.boards.length+1, false, "", "");
    $scope.boards.push(blankBoard);
  };

  // Remove specific board with given id
  $scope.removeBoard = function(id) {
    if ($scope.boards.length == 0) {
      return;
    }
    // console.log($scope.boards);
    $scope.boards.splice(id - 1, 1);
    for (i = id - 1; i < $scope.boards.length; i++)  {
      $scope.boards[i].id--;
    }
    // console.log($scope.boards);
  }

  // Get users boards
  $scope.getBoards = function() {
    $scope.boards = [];
    // Database call to load up this users current boards
    
    $http({
      method: 'GET',
      url: '/clipboards/'
    }).then(function successCallback(response) {
      for (var i = 0; i < response.data.length; i++) {
        $scope.createBoard(response.data[i].name);
      }
      console.log(response);
    }, function errorCallback(response) {
      alert('Error getting clipboards. See console for more details.');
      console.log(response);
    });
  
    
    // Creating basic boards for testing purposes
    //$scope.createBasicBoard();
    //$scope.createBlankBoard();
    //$scope.createBlankBoard();
  };

  // Create blank boards when not logged in, serve as background data
  $scope.getBlankBoards = function() {
    $scope.boards = [];
    $scope.createBlankBoard();
    $scope.createBlankBoard();
    $scope.createBlankBoard();
  }

  // If the user is already logged in, load their boards. Otherwise, load the blank boards
  /*
  if ($scope.loggedIn) {
    $('#dimmer').hide();
    $scope.getBoards();
  }
  else {
    $scope.getBlankBoards();
  }
  */

  // Copy function
  $scope.copyFromBoard = function(board) {
    if (!board.hasContent) {
      // Return if this board is blank
      return;
    }
    $('#copyAlert').hide(); // Hide stacked copy notifications

    // Create off-screen text area, populate it with this boards data, execute a copy, delete this off-screen text area
    var textarea = document.createElement( "textarea" );
    textarea.style.height = "0px";
    textarea.style.left = "-100px";
    textarea.style.opacity = "0";
    textarea.style.position = "fixed";
    textarea.style.top = "-100px";
    textarea.style.width = "0px";
    document.body.appendChild( textarea );
    textarea.value = board.content;
    textarea.select();
    document.execCommand('copy');
    textarea.parentNode.removeChild( textarea );

    // Show copy alert and fade it out after 3 seconds
    $('#copyAlert').show();
    setTimeout(function() {
      $('#copyAlert').fadeOut(300);
    }, 3000);
  };

  // Paste function
  $scope.pasteToBoard = function(board) {
    // Update board variable, will update the blank board's look to have the same look as the full boards
    board.pasting = true;
    board.hasContent = true;
    setTimeout(function() {
      // Auto put cursor in this boards textbox, the timeout is so the user's click doesn't override this (slight delay)
      $("#" + board.id + "pasting").focus();
    }, 200);
  };

  // Save the paste when the user hits error
  $scope.keyCheck = function(e, board) {
    if (e.keyCode == 13) {
      $scope.savePaste(board);
    }
  };

  // Save user's paste
  $scope.savePaste = function(board) {
    // Hide overlapping paste alert
    $('#pasteAlert').hide();
    // Update variables
    board.pasting = false;
    board.hasContent = true;

    $http({
      method: 'POST',
      url: '/clipboards/',
      data: {
        name: board.content
      }
    }).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      alert('Error saving clipboard. See console for more details');
      console.log(response);
    });

    // Filter the preview to be displayed if the content is too long
    board.preview = $scope.filterPreview(board.content);

    // Show successful paste alert, fade
    $('#pasteAlert').show();
    setTimeout(function() {
      $('#pasteAlert').fadeOut(300);
    }, 3000);
    // Send to server
  };

  // If the content of the board is longer than 45 characters, give it a '...' (can be made to any length)
  $scope.filterPreview = function(x) {
    if (typeof x == undefined) {
      return "";
    }
    if (x.length <= 45) {
      return x;
    }
    else {
      return x.substring(0, 44) + "...";
    }
  }

}]);

// Login controller, has control over the mini form displayed when not logged in
app.controller('login', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
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

  // Login function
  $scope.logIn = function() {
    $('button').prop('disabled', true);
    // TODO: POST DATA TO LOGIN ENDPOINT
    /*
    var form = $("#loginForm");
    form.bind('ajax:complete', function() {
      console.log('finished logging in');
      loginService.logIn($scope.username, $scope.password);
      $scope.loggedIn = loginService.getLoginStatus();
    });
    */
    $('form').submit();
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
      $('button').prop('disabled', true);
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
        $('button').prop('disabled', false);
      }, function errorCallback(response) {
        console.log(response);
        if (typeof response.data.username != 'undefined') {
          for (var i = 0; i < response.data.username.length; i++) {
            $('#usernameError').append(response.data.username[i] + '<br />');
          }
        }
        if (typeof response.data.password != 'undefined') {
          for (var i = 0; i < response.data.password.length; i++) {
            $('#passwordError').append(response.data.password[i] + '<br />');
          }
        }
        if (typeof response.data.email != 'undefined') {
          for (var i = 0; i < response.data.email.length; i++) {
            $('#emailError').append(response.data.email[i] + '<br />');
          }
        }
        $('button').prop('disabled', false);
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
      $('button').prop('disabled', true);
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
        alert('Password Reset Email Sent');
        $scope.forgettingPassword = false;
        $scope.creatingAccount = false;
        $scope.accountCreated = false;
        $('button').prop('disabled', false);
        $('form').show();
      }, function errorCallback(response) {
        console.log(response);
      });
    }
  };
}]);

app.controller('reset', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.newPass;
  $scope.confirmPass;
  $scope.uid = $location.search().uid;
  $scope.token = $location.search().token;

  $scope.resetPassword = function() {
    $('button').prop('disabled', true);
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
      window.location = $('#homeLink').href;
    }, function errorCallback(response) {
      console.log(response);
      if (typeof response.data.new_password != 'undefined') {
        for (var i = 0; i < response.data.new_password.length; i++) {
          $('#newPasswordError').append(response.data.new_password[i] + '<br />');
        }
      }
      if (typeof reponse.data.re_new_password != 'undefined') {
        for (var i = 0; i < response.data.re_new_password.length; i++) {
          $('#confirmPasswordError').append(response.data.re_new_password[i] + '<br />');
        }
      }
      $('button').prop('disabled', false);
    });
  }
}]);
