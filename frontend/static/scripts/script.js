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

function colorChange(color) {
  //console.log(color);
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);
  //console.log(R + ' ' + G + ' ' + B);
  var newColor = "rgb("+R+", "+G+", "+B+")";
  $('.navbar').css('background-color', newColor);
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
