app.controller('settings', ['$scope', '$cookies', function($scope, $cookies) {
    $scope.headerColor = "#2474EB";
    $scope.fullBoardColor = "#5190ED";
    $scope.emptyBoardColor = "#94BAF3";
    $scope.inversion;

    $scope.RGBColorToHex = function(RGBstring) {
      var a = RGBstring.split("(")[1].split(")")[0];
      a = a.split(", ");
      var b = a.map(function(x) {
        x = Number(x).toString(16);
        return (x.length == 1) ? "0"+x : x;
      });
      return "#"+b.join("");
    }

    $scope.hexColorToRGB = function(hexString) {
      var R = parseInt(hexString.substring(1, 3), 16);
      var G = parseInt(hexString.substring(3, 5), 16);
      var B = parseInt(hexString.substring(5, 7), 16);
      return "rgb("+R+", "+G+", "+B+")";
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

    $scope.getBoardColors();

    $scope.headerColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.headerColor);
      $('.navbar').css('background-color', newColor);
    };

    $scope.fullBoardColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.fullBoardColor);
      for (var i = 0; i < document.styleSheets[1].cssRules.length; i++) {
        if (document.styleSheets[1].cssRules[i].selectorText == ".board-full") {
          document.styleSheets[1].cssRules[i].style.setProperty('background-color', newColor, "important");
          return;
        }
      }
    };

    $scope.emptyBoardColorChange = function() {
      var newColor = $scope.hexColorToRGB($scope.emptyBoardColor);
      for (var i = 0; i < document.styleSheets[1].cssRules.length; i++) {
        if (document.styleSheets[1].cssRules[i].selectorText == ".board-empty") {
          document.styleSheets[1].cssRules[i].style.setProperty('background-color', newColor, "important");
          return;
        }
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

    $scope.saveColors = function() {
      $cookies.put('headerColor', $scope.headerColor);
      $cookies.put('fullBoardColor', $scope.fullBoardColor);
      $cookies.put('emptyBoardColor', $scope.emptyBoardColor);
    };
}]);