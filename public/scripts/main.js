'use strict';

// our App
var indeedApp = {};
indeedApp.apiKey = '1211867702868069';
indeedApp.endpoint = 'https://api.indeed.com/ads/apisearch';

// Google Autocomplete for Main Form
google.maps.event.addDomListener(window, 'load', function () {
	var places = new google.maps.places.Autocomplete(document.getElementById('jobLocation'));
	google.maps.event.addListener(places, 'place_changed', function () {
		var place = places.getPlace();

		// grabs 2 character country code to use in AJAX call
		var addressComponentArrayLength = place.address_components.length;
		formInputs.country = place.address_components[addressComponentArrayLength - 1].short_name;
		console.log(place);
	});
});

// Google Autocomplete for Sticky Header
google.maps.event.addDomListener(window, 'load', function () {
	var places = new google.maps.places.Autocomplete(document.getElementById('jobLocation__nav'));
	google.maps.event.addListener(places, 'place_changed', function () {
		var place = places.getPlace();

		// grabs 2 character country code to use in AJAX call
		var addressComponentArrayLength = place.address_components.length;
		formInputs.country = place.address_components[addressComponentArrayLength - 1].short_name;
		console.log(place);
	});
});

// set up formInputs object
var formInputs = {};
// let places;
// let place;
// let addressComponentArrayLength;


// Init Function
indeedApp.init = function () {
	indeedApp.events();
};

// Event Listeners
indeedApp.events = function () {

	// on submit of Form element
	$('.userInputs').on('submit', function (e) {
		e.preventDefault();

		// Grab Input Value and put in formInputs Object
		formInputs.query = $(this).find('.jobTitle').val();
		formInputs.location = $(this).find('#jobLocation').val();
		formInputs.type = $(this).find('.jobType').val();

		indeedApp.getJobs(); // Make AJAX call on Submit


		$('.cardsContainer').empty();

		// add stickiness + animation to nav header
		$('.nav').addClass('sticky animated slideInDown');
		$('.userInputs__nav').css('display', 'block');

		// Scroll to top of results
		$('html,body').animate({
			scrollTop: $(".cardsContainer").offset().top - 100 }, 'slow');
	});

	// Expand boxes on Click
	$('.cardsContainer').on('click', '.jobCard-container', function () {
		var expand = $(this).find('.jobDesc');
		expand.slideToggle(500);
	});

	$(window).scroll(function () {
		var top_offset = $(window).scrollTop();
		if (top_offset <= 600) {
			$('.userInputs__nav').css('display', 'none');
		} else {
			$('.userInputs__nav').css('display', 'block');
		}
	});
};

// $('.userInputs__nav').on()

// $(window).on('scroll', function() {
// 	if ($(this).scrollTop() < $(window).height() ) {
// 	            $nav.removeClass
// })
// Ajax Call
indeedApp.getJobs = function () {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: indeedApp.endpoint,
			params: {
				publisher: indeedApp.apiKey,
				v: 2,
				format: 'json',
				q: formInputs.query,
				l: formInputs.location,
				radius: 25,
				jt: formInputs.type,
				// start: i === 0 ? 0 : i * 24 + 1,
				start: 0,
				limit: 24,
				hightlight: 1,
				co: formInputs.country
			}
		}
	}).then(function (res) {
		// console.log(res);
		// console.log(res.results);

		// calculate how many ajax calls in the for loop
		if (res.totalResults <= 24) {
			var _jobsDataArray = res.results;
			var jobsTotalResults = res.totalResults;
			// console.log(jobsTotalResults);
			indeedApp.displayJobs(_jobsDataArray, jobsTotalResults);
		} else if (res.totalResults <= 480) {
			// for (i = 1; i <= Math.floor(res.totalResults / 24); i++) {
			for (i = 1; i <= Math.floor(res.totalResults / 24); i++) {
				$.ajax({
					url: 'https://proxy.hackeryou.com',
					dataType: 'json',
					method: 'GET',
					data: {
						reqUrl: indeedApp.endpoint,
						params: {
							publisher: indeedApp.apiKey,
							v: 2,
							format: 'json',
							q: formInputs.query,
							l: formInputs.location,
							radius: 25,
							jt: formInputs.type,
							start: i * 24,
							limit: 24,
							hightlight: 1,
							co: formInputs.country
						}
					}
				}).then(function (res) {
					// console.log(res);
					// console.log(res.results);
					jobsDataArray = res.results;
					indeedApp.displayJobs(jobsDataArray);
				});
			}
		} else if (res.totalResults > 480) {
			for (i = 1; i <= 20; i++) {
				$.ajax({
					url: 'https://proxy.hackeryou.com',
					dataType: 'json',
					method: 'GET',
					data: {
						reqUrl: indeedApp.endpoint,
						params: {
							publisher: indeedApp.apiKey,
							v: 2,
							format: 'json',
							q: formInputs.query,
							l: formInputs.location,
							radius: 25,
							jt: formInputs.type,
							start: i * 24,
							limit: 24,
							hightlight: 1,
							co: formInputs.country
						}
					}
				}).then(function (res) {
					// console.log(res);
					// console.log(res.results);
					jobsDataArray = res.results;
					indeedApp.displayJobs(jobsDataArray);
				});
			}
		}
	});
};

indeedApp.displayJobs = function (jobs, results) {

	if (results === 0) {
		var noResults = '<h5>Sorry, no results. Please try a different search.</h5>';
		$('.appOutputs').append(noResults);
	}

	jobs.forEach(function (job, i) {
		var jobTitle = '<h3>' + job.jobtitle + '</h3>';
		var jobComp = '<h4>' + job.company + '</h4>';
		var jobDesc = '<p class="jobDesc">' + job.snippet + '</p>';
		var jobUrl = '<a href=' + job.url + ' target="_blank">Full Job Posting</a>';
		var jobCard = '<div class="jobCard-container animated">' + jobTitle + jobComp + jobDesc + jobUrl;
		// console.log(jobCard);
		// Print Cards
		if (i % 2 === 0) {
			$('.containerLeft').append(jobCard);
		} else {
			$('.containerRight').append(jobCard);
		}
	});
};

// Document Ready
$(indeedApp.init);