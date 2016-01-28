var app = angular.module('personApp',['ui.router','ngResource']);

app.config(function($stateProvider) {
	$stateProvider.state('persons', {
		url: '/persons',
		templateUrl: 'partials/persons.html',
		controller: 'PersonListController'
	}).state('viewPerson', { //state for showing single movie
	    url: '/persons/:id/view',
	    templateUrl: 'partials/person-view.html',
	    controller: 'PersonViewController'
	  }).state('newPerson', { //state for adding a new movie
	    url: '/persons/new',
	    templateUrl: 'partials/person-add.html',
	    controller: 'PersonCreateController'
	  }).state('editPerson', { //state for updating a movie
	    url: '/persons/:id/edit',
	    templateUrl: 'partials/person-edit.html',
	    controller: 'PersonEditController'
	  });
	}).run(function($state) {
	  $state.go('persons'); //make a transition to movies state when app starts
});

app.factory('Person', function($resource) {
	return $resource('/jee7fiddle-1.0CreatingCRUDAppWithAngulars$resource/resources/persons/:id', { id: '@id'}, {
		update: {
		      method: 'PUT'
		    }
		}); // Note the full endpoint address
	});

app.controller('PersonListController', function($scope, $state, $window, Person) {
	  $scope.persons = Person.query(); //fetch all movies. Issues a GET to /api/movies

	  $scope.deletePerson = function(person) { // Delete a movie. Issues a DELETE to /api/movies/:id
	    
	    	person.$delete(function() {
	        $window.location.href = ''; //redirect to home
	      });
	    
	  };
	}).controller('PersonViewController', function($scope, $stateParams, Person) {
	  $scope.person = Person.get({ id: $stateParams.id }); //Get a single movie.Issues a GET to /api/movies/:id
	}).controller('PersonCreateController', function($scope, $state, $stateParams, Person) {
	  $scope.person = new Person();  //create new movie instance. Properties will be set via ng-model on UI

	  $scope.addPerson = function() { //create a new movie. Issues a POST to /api/movies
	    $scope.person.$save(function() {
	      $state.go('persons'); // on success go back to home i.e. movies state.
	    });
	  };
	}).controller('PersonEditController', function($scope, $state, $stateParams, Person) {
	  $scope.updatePerson = function() { //Update the edited movie. Issues a PUT to /api/movies/:id
		  delete $scope.person.$promise;
		  delete $scope.person.$resolved;
		  $scope.person.$update(function() {
	      $state.go('persons'); // on success go back to home i.e. movies state.
	    });
	  };

	  $scope.loadPerson = function() { //Issues a GET request to /api/movies/:id to get a movie to update
	    $scope.person = Person.get({ id: $stateParams.id });
	  };

	  $scope.loadPerson(); // Load a movie which can be edited on UI
	});

