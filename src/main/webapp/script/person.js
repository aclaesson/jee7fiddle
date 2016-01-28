var app = angular.module('persons', [ 'ui.bootstrap' ]);

app.controller('personsList', ['$http', '$filter', '$window', function($http, $filter, $window) {
	var person = this;

	getData($http, person);

	person.currentPage = 1;
	person.itemsPerPage = 5;

	//order
	var orderBy = $filter('orderBy');

	person.changeOrder = function(predicate) {
		person.predicate = predicate;
		person.reverse = (person.predicate === predicate) ? !person.reverse : false;
		person.listOfPersons = orderBy(
				person.listOfPersons, predicate,
				person.reverse);
		
	}
	
	person.updatePerson = function() {
		
		var newPersonJson = angular.toJson(person.newPerson);
		
		saveData($http, newPersonJson);
		person.listOfPersons.push(person.newPerson);
		person.newPerson = null;
		
	}
	
	person.clearForm = function() {
		person.newPerson = null;
	}
	
}
]);


function getData($http, person) {
	$http.get("resources/persons")
		.then(function(response) {
				var listOfPersons = response.data;
				person.listOfPersons = listOfPersons;
				person.totalItems = listOfPersons.length;
			});
}

function saveData($http, newPerson) {
	
	$http({
	       method: 'POST',
	       url: 'resources/persons',
	       data: newPerson,
	       headers: {
	            'Content-Type': 'application/json'
	       }
		});
}
