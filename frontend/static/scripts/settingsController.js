app.controller('settings', ['$scope', '$cookies', '$window', function($scope, $cookies, $window) {
    $scope.headerColor = "#2474EB";
    $scope.fullBoardColor = "#5190ED";
    $scope.emptyBoardColor = "#94BAF3";
    $scope.inversion;
    $scope.now = new $window.Date();
    $scope.headerFontSize = 37;
    $scope.boardHeaderFontSize = 28;
    $scope.boardTextFontSize = 15;
    $scope.boardActionIconSize;
    $scope.boardActionOriginalIconSize;

    $scope.getFontSizes = function() {
      var cookieHeaderFontSize = $cookies.get('headerFontSize');
      var cookieBoardHeaderFontSize = $cookies.get('boardHeaderFontSize');
      var cookieBoardTextFontSize = $cookies.get('boardTextFontSize');
      if (typeof cookieHeaderFontSize != 'undefined') {
        $scope.headerFontSize = cookieHeaderFontSize;
        $scope.updateHeaderFontSize();
      }
      if (typeof cookieBoardHeaderFontSize != 'undefined') {
        $scope.boardHeaderFontSize = cookieBoardHeaderFontSize;
        $scope.updateBoardHeaderFontSize();
      }
      if (typeof cookieBoardTextFontSize != 'undefined') {
        $scope.boardTextFontSize = cookieBoardTextFontSize;
        $scope.updateBoardTextFontSize();
      }
    };

    $scope.increaseAllFontSizes = function() {
      $scope.increaseHeaderFontSize();
      $scope.increaseBoardHeaderFontSize();
      $scope.increaseBoardTextFontSize();
    };

    $scope.decreaseAllFontSizes = function() {
      $scope.decreaseHeaderFontSize();
      $scope.decreaseBoardHeaderFontSize();
      $scope.decreaseBoardTextFontSize();
    };

    $scope.updateHeaderFontSize = function() {
      $('.navbar-header h1').css('font-size', $scope.headerFontSize + "px");
      $scope.setCookie('headerFontSize', $scope.headerFontSize);
    }

    $scope.increaseHeaderFontSize = function() {
      $scope.headerFontSize++;
      $scope.updateHeaderFontSize();
    };

    $scope.decreaseHeaderFontSize = function() {
      $scope.headerFontSize--;
      $scope.updateHeaderFontSize();
    };

    $scope.updateBoardHeaderFontSize = function() {
      $scope.updateCSSRule(".boardHeader", 'font-size', $scope.boardHeaderFontSize + "px");
      $scope.setCookie('boardHeaderFontSize', $scope.boardHeaderFontSize);
    }

    $scope.increaseBoardHeaderFontSize = function() {
      $scope.boardHeaderFontSize++;
      $scope.updateBoardHeaderFontSize();
    };

    $scope.decreaseBoardHeaderFontSize = function() {
      $scope.boardHeaderFontSize--;
      $scope.updateBoardHeaderFontSize();
    };

    $scope.updateBoardTextFontSize = function() {
      $scope.updateCSSRule(".board-text", 'font-size', $scope.boardTextFontSize + "px");
      $scope.setCookie('boardTextFontSize', $scope.boardTextFontSize);
    };

    $scope.increaseBoardTextFontSize = function() {
      $scope.boardTextFontSize++;
      $scope.updateBoardTextFontSize();
    };

    $scope.decreaseBoardTextFontSize = function() {
      $scope.boardTextFontSize--;
      $scope.updateBoardTextFontSize();
    };

    $scope.RGBColorToHex = function(RGBstring) {
      var a = RGBstring.split("(")[1].split(")")[0];
      a = a.split(", ");
      var b = a.map(function(x) {
        x = Number(x).toString(16);
        return (x.length == 1) ? "0"+x : x;
      });
      return "#"+b.join("");
    };

    $scope.hexColorToRGB = function(hexString) {
      var R = parseInt(hexString.substring(1, 3), 16);
      var G = parseInt(hexString.substring(3, 5), 16);
      var B = parseInt(hexString.substring(5, 7), 16);
      return "rgb("+R+", "+G+", "+B+")";
    };

    $scope.headerColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.headerColor);
      $('.navbar').css('background-color', newColor);
      $scope.setCookie('headerColor', $scope.headerColor);
    };

    $scope.fullBoardColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.fullBoardColor);
      $scope.updateCSSRule(".board-full", 'background-color', newColor);
      $scope.setCookie('fullBoardColor', $scope.fullBoardColor);
    };

    $scope.emptyBoardColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.emptyBoardColor);
      $scope.updateCSSRule(".board-empty", 'background-color', newColor);
      $scope.setCookie('emptyBoardColor', $scope.emptyBoardColor);
    };

    $scope.getBoardColors = function() {
      var cookieHeader = $cookies.get('headerColor');
      var cookieFull = $cookies.get('fullBoardColor');
      var cookieEmpty = $cookies.get('emptyBoardColor');
      if (typeof cookieHeader != 'undefined') {
        $scope.headerColor = cookieHeader;
        $scope.headerColorChange();
      }
      if (typeof cookieFull != 'undefined') {
        $scope.fullBoardColor = cookieFull;
        $scope.fullBoardColorChange();
      }
      if (typeof cookieEmpty != 'undefined') {
        $scope.emptyBoardColor = cookieEmpty;
        $scope.emptyBoardColorChange();
      }
    };
      
    $scope.invert = function() {
      $("html").toggleClass('inverted');
    };

    $scope.resetColors = function() {
      $scope.headerColor = "#2474eb";
      $scope.headerColorChange();
      $scope.fullBoardColor = "#5190ED";
      $scope.fullBoardColorChange();
      $scope.emptyBoardColor = $scope.RGBColorToHex("rgb(148, 186, 243)");
      $scope.emptyBoardColorChange();
      if ($scope.inversion) {
        $scope.invert();
        $scope.inversion = false;
      }
    };

    $scope.resetFontSize = function() {
      $scope.headerFontSize = 37;
      $scope.updateHeaderFontSize();
      $scope.boardHeaderFontSize = 28;
      $scope.updateBoardHeaderFontSize();
      $scope.boardTextFontSize = 15;
      $scope.updateBoardTextFontSize();
    };

    $scope.updateCSSRule = function(selectorText, property, value) {
      for (var i = 0; i < document.styleSheets[1].cssRules.length; i++) {
        if (document.styleSheets[1].cssRules[i].selectorText == selectorText) {
          document.styleSheets[1].cssRules[i].style.setProperty(property, value, "important");
          break;
        }
      }
    };

    $scope.setCookie = function(key, value) {
      $cookies.put(key, value, {
        expires: new $window.Date($scope.now.getFullYear(), $scope.now.getMonth()+6, $scope.now.getDate())
      });
    };

    $scope.initialize = function() {
      $scope.getBoardColors();
      $scope.getFontSizes();
    };

    $scope.initialize();
}]);