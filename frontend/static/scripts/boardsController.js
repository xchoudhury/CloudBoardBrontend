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
  
   $scope.expand = function($event, board) {
    console.log($event.target.parentNode.parentNode);
  
    $($event.target.parentNode.parentNode.parentNode).stop(true, false).animate({
      height: board.expanded ? 107 : 321
    }, 200);
  
    board.expanded = !board.expanded;
  };
  
  
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