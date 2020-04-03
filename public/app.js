// public/core.js
var app = angular.module('helloWorld', [])

    .controller('MainCtrl', [
        '$scope',
        function($scope) {
            $scope.test = 'Hello World! Your first MEAN Stack App on Digital Garage';
        }
    ]);