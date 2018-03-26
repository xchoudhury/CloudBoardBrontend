// Board object constructor
function Board(id, name, hasContent) {
  this.id = id;
  this.name = name;
  this.preview = name;
  this.content = name;
  this.hasContent = hasContent;
  this.expanded = false;
  this.data = [];
}

// Snippet object constructor
function Snippet(id, content) {
  this.id = id;
  this.content = content;
}

// Appends the errors present in the errorArray to the span class pointed to by the errorID
function printErrors(errorArray, errorID) {
  if (typeof errorArray != 'undefined') {
    for (var i = 0; i < errorArray.length; i++) {
      $('#' + errorID).append(errorArray[i] + '<br />');
    }
  }
}

// Creates error alert with message
function alertError(message) {
  var error = $('#errorAlert').clone();
  error.find('span').html(message);
  $('body').append(error);
  error.show();
  setTimeout(function() {
    error.fadeOut(300, function() {
      $(this).remove();
    });
  }, 3000);
}

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

app.run(function($rootScope) {
  $rootScope.view = "home";
});

app.controller('header', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.goHome = function() {
    $rootScope.view = "home";
  };
}]);
