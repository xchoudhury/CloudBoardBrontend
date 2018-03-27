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
      $('.boardsView').hide();
      $('#boardsLoader').show();
    });
  
    $scope.$on('loggingOut', function() { // Clear boards when the user logs out
      $scope.loggedIn = false;
      $scope.name = loginService.getUserName();
      $scope.getBlankBoards();
    })
  
    // Create a board from passed in name
    $scope.createBoard = function(id, name) {
      var board = new Board(id, name, true);
      // GET SNIPPETS
      $http({
        method: 'GET',
        url: '/clipboards/'+id+'/snippet/'
      }).then(function successCallback(response) {
        console.log(response);
        if (response.data.length == 0) {
          board.hasContent = false;
        }
        else {
          for (var i = 0; i < response.data.length; i++) {
            board.data.push(new Snippet(response.data[i].id, response.data[i].text));
          }
        }
      }, function errorCallback(response) {
        console.log(response);
        alertError('Error: Could not get snippets for board ID ' + id + '. Response status ' + response.status + '.');
      })
      $scope.boards.push(board);
    };
    
    $scope.createEmptyBoard = function(id, name) {
      var board = new Board(id, name, false);
      $scope.boards.push(board);
    };
  
    // Creates a blank board and adds it to the end of the boards arrays
    $scope.createBlankBoard = function() {
      var blankBoard = new Board($scope.boards.length, "Board " + $scope.boards.length, false);
      $scope.boards.push(blankBoard);
    };

    $scope.createNewBoard = function() {
      $http({
        method: 'POST',
        url: '/clipboards/',
        data: {
          name: String("Board " + $scope.boards.length)
        }
      }).then(function successCallback(response) {
        console.log(response);
        $scope.createEmptyBoard(response.data.id, response.data.name);
      }, function errorCallback(response) {
        alertError('Error: Could not create a new board. Response status ' + response.status + '.');
        console.log(response);
      });
    };
    
    $scope.removingBoard = false;
    $scope.removeID = -1;
    // Remove specific board with given id
    $scope.removeBoard = function(id) {
      if (!$scope.removingBoard) {
        $('#deleteBoardModal').modal('show');
        $scope.removingBoard = true;
        $scope.removeID = id;
        return;
      }
      if ($scope.boards.length == 0) {
        return;
      }
      if ($scope.removeID == -1) {
        return;
      }
      // console.log($scope.boards);
      $http({
        method: 'DELETE',
        url: '/clipboards/',
        data: {
          id: String($scope.removeID)
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function successCallback(response) {
        console.log(response);
        for (var i = 0; i < $scope.boards.length; i++) {
          if ($scope.boards[i].id == $scope.removeID) {
            $scope.boards.splice(i, 1);
          }
        }
        $scope.removingBoard = false;
        $scope.removeID = -1;
      }, function errorCallback(response) {
        console.log(response);
        alertError('Error: Could not remove board ID ' + id + '. Response status ' + response.status + '.');
      });
      $('#deleteBoardModal').modal('hide');
    };

    $scope.renameKeyCheck = function(e) {
      if (e.keyCode == 13) {
        $scope.renameBoard();
      }
    };

    $scope.renamingBoard = false;
    $scope.renameID = -1;
    $scope.rename = "";
    // Rename a board with a given id
    $scope.renameBoard = function(id = $scope.renameID) {
      if (!$scope.renamingBoard) {
        $('#renameBoardModal').modal('show');
        $scope.renamingBoard = true;
        $scope.renameID = id;
        for (var i = 0; i < $scope.boards.length; i++) {
          if ($scope.boards[i].id == id) {
            $scope.rename = $scope.boards[i].name;
            break;
          }
        }
        setTimeout(function() {
          $("#renameInput").focus();
        }, 200);
        return;
      }
      if ($scope.boards.length == 0) {
        return;
      }
      if ($scope.renameID == -1) {
        return;
      }
      $http({
        method: 'PUT',
        url: '/clipboards/',
        data: {
          id: $scope.renameID,
          name: $scope.rename
        }
      }).then(function successCallback(response) {
        console.log(response);
        for (var i = 0; i < $scope.boards.length; i++) {
          if ($scope.boards[i].id == $scope.renameID) {
            $scope.boards[i].name = $scope.rename;
          }
        }
        $scope.renamingBoard = false;
        $scope.renameID = -1;
        $scope.rename = "";
        $('#renameBoardModal').modal('hide');
      }, function errorCallback(response) {
        console.log(response);
        printErrors(response.data.name, 'renameBoardError');
      });
    };

    function createBoardPromise(id, name) {
      return new Promise(resolve => {
        var board = new Board(id, name, true);
        // GET SNIPPETS
        $http({
          method: 'GET',
          url: '/clipboards/'+id+'/snippet/'
        }).then(function successCallback(response) {
          console.log(response);
          if (response.data.length == 0) {
            board.hasContent = false;
          }
          else {
            for (var i = 0; i < response.data.length; i++) {
              board.data.push(new Snippet(response.data[i].id, response.data[i].text));
            }
          }
          $scope.boards.push(board);
          resolve();
        }, function errorCallback(response) {
          console.log(response);
          alertError('Error: Could not get snippets for board ID ' + id + '. Response status ' + response.status + '.');
        });
      });
    }
  
    // Get users boards
    $scope.getBoards = function() {
      $scope.boards = [];
      // Database call to load up this users current boards
      $http({
        method: 'GET',
        url: '/clipboards/'
      }).then(function successCallback(response) {
        var promises = [];
        for (var i = 0; i < response.data.length; i++) {
          promises.push(createBoardPromise(response.data[i].id, response.data[i].name));
        }
        Promise.all(promises).then(function() {
          $('#boardsLoader').hide();
          $('.boardsView').slideDown("slow", function() {});
        })
      }, function errorCallback(response) {
        alertError('Error: Could not get clipboards. Response status ' + response.status + '.');
        console.log(response);
      });
    };
  
    // Create blank boards when not logged in, serve as background data
    $scope.getBlankBoards = function() {
      $scope.boards = [];
      $scope.createBlankBoard();
      $scope.createBlankBoard();
      $scope.createBlankBoard();
    }
  
    $scope.expand = function($event, board) {
      for (var i = 0; i < $scope.boards.length; i++) {
        if ($scope.boards[i].expanded && $scope.boards[i].id != board.id) {
          $('#' + $scope.boards[i].id + 'snippets').slideUp('slow', function(){});
          $('#' + $scope.boards[i].id + 'board').stop(true, false).animate({
            width: "80%"
          }, 400);
          $scope.boards[i].expanded = false;
        }
      }
      $('#' + board.id + 'snippets').slideToggle('slow', function() {});
      $('#' + board.id + 'board').stop(true, false).animate({
        width: board.expanded ? "80%" : "100%"
      }, 400);
      board.expanded = !board.expanded;
    };
  
    // Copy function
    $scope.copySnippet = function(snippet) {
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
      textarea.value = snippet.content;
      textarea.select();
      document.execCommand('copy');
      textarea.parentNode.removeChild( textarea );
  
      // Show copy alert and fade it out after 3 seconds
      $('#copyAlert').show();
      setTimeout(function() {
        $('#copyAlert').fadeOut(300);
      }, 3000);
    };

    // New Snippet function
    $scope.addSnippet = function(board) {
      $http({
        method: 'POST',
        url: '/clipboards/'+board.id+'/snippet/'
      }).then(function successCallback(response) {
        console.log(response);
        var snippet = new Snippet(response.data.id, "");
        if (board.data.length == 0) {
          board.hasContent = true;
        }
        board.data.push(snippet);
        setTimeout(function() {
          $("#" + board.id + snippet.id + "pasting").focus();
        }, 100);
      }, function errorCallback(response) {
        console.log(response);
        alertError('Error: Could not add snippet to board ID ' + board.id + '. Response status ' + response.status + '.');
      })
    };

    $scope.removeSnippet = function(boardID, snippetID) {
      $http({
        method: 'DELETE',
        url: '/clipboards/'+boardID+'/snippet/',
        data: {
          snip_id: snippetID
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function successCallback(response) {
        console.log(response);
        for (var i = 0; i < $scope.boards.length; i++) {
          if ($scope.boards[i].id == boardID) {
            for (var j = 0; j < $scope.boards[i].data.length; j++) {
              if ($scope.boards[i].data[j].id == snippetID) {
                $scope.boards[i].data.splice(j, 1);
                break;
              }
            }
          }
        }
      }, function errorCallback(response) {
        console.log(response);
        alertError('Error: Could not remove snippet ID ' + snippetID + ' from board ID ' + boardID + '. Response status ' + response.status + '.');
      })
    };
  
    // Save the paste when the user hits error
    $scope.pasteKeyCheck = function(e, board, snippet) {
      if (e.keyCode == 13) {
        $scope.savePaste(board, snippet);
      }
    };
  
    // Save user's paste
    $scope.savePaste = function(board, snippet) {
      //console.log(board);
      // Hide overlapping paste alert
      $('#pasteAlert').hide();
      // Update variables
      board.hasContent = true;

      $http({
        method: 'PUT',
        url: '/clipboards/'+board.id+'/snippet/',
        data: {
          snip_id: snippet.id,
          text: snippet.content
        }
      }).then(function successCallback(response) {
        console.log(response);
        setTimeout(function() {
          $("#" + board.id + snippet.id + "pasting").blur();
        }, 100);
        // Show successful paste alert, fade
        $('#pasteAlert').show();
        setTimeout(function() {
          $('#pasteAlert').fadeOut(300);
        }, 3000);
      }, function errorCallback(response) {
        alertError('Error: Could not save paste to snippet ID ' + snippet.id + ' in board ID ' + board.id + '. Response status ' + response.status + '.');
        console.log(response);
      })
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
    };
  
  }]);