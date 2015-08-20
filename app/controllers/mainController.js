;(function() { 'use strict';
  var app = angular.module('searcherUbicate', []);

  // main controller
  app.controller('mainController', function mainController($scope, $http) {
  	// areas
  	$scope.areas = ['Aeronáutica', 'Educación'];

  	// get data json
  	$http.get('data-carreras.json').then(function (response) {
  		$scope.careers = response.data;
  		// console.log(response.data);
  	});
  });
}());