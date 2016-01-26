angular
		.module('persons', [ 'ui.bootstrap' ])
		.controller('personsList', ['$http', '$filter', '$window', function($http, $filter, $window) {
							var person = this;

							$http.get("resources/persons")
									.then(
											function(response) {
												var listOfPersons = response.data.personList;
												person.listOfPersons = listOfPersons;
												person.totalItems = listOfPersons.length;
											});

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
							

						} ]);

