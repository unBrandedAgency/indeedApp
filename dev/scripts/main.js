// our App
var indeedApp = {};
indeedApp.apiKey = '1211867702868069'
indeedApp.endpoint = 'https://api.indeed.com/ads/apisearch'

google.maps.event.addDomListener(window, 'load', function () {
	var places = new google.maps.places.Autocomplete(document.getElementById('jobLocation'));
	google.maps.event.addListener(places, 'place_changed', function () {
       var place = places.getPlace();
       var address = place.formatted_address;
       console.log(place)
       console.log(place[address_components][0].short_name);
    });
});

// set up formInputs object
var formInputs = {};

// Document Ready Calls Init

// Init Function
indeedApp.init = () => {
	indeedApp.events();
	console.log('hi!');

};

// Event Listeners
indeedApp.events = () => {
	// google.maps.event.addListener(autocomplete, 'place_changed', function () {
	//     place = autocomplete.getPlace();
	//     console.log(place);
 //   });

	$('form').on('submit', function(e) { // on submit of Form element, runs handleSubmit function.
		e.preventDefault();

		$('.userInputs').addClass('fixed-header');

		// empty container
		$('.cardsContainer').empty();

			// Use Destructuring??
		formInputs.query = $('.jobTitle').val(); // Grab Input Value and put in formInputs Object
		formInputs.location = $('.jobLocation').val();
		formInputs.type = $('.jobType').val();

		indeedApp.getJobs(); // Make AJAX call on Submit
	});
//write a function so that on cardsContainer click, we want to toggle the class of p tag which is a display none to display block (needs to be specific to the one clicked)
	$('.cardsContainer').on('click', '.jobCard-container', function(){
		var expand = $(this).find('.jobDesc');
		expand.toggleClass('bigBox');
		console.log('hi!');
		// $(this).toggleClass("bigBox");
		// this.animate({height: '400px', '40%'}, 300);
	});
}

// indeedApp.handleSubmit = function(e) {
// };

// Ajax Call
indeedApp.getJobs = function() {
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
				sort: 'relevance',
				radius: 25,
				// st: 'jobsite',
				jt: formInputs.jobType,
				// start: 0,
				limit: 50,
				// fromage: 14,
				// filter: 0,
				latlong: 1.0000,
				// co: 'ca',
			},
		},
	})
	.then(function(res) {
		var jobsDataArray = res.results;
		console.log(jobsDataArray)
		// console.log(res.results);
		indeedApp.displayJobs(jobsDataArray);
	});
};

indeedApp.displayJobs = function(jobs) {
	jobs.forEach(function(job) {
		let jobTitle = `<h3>${job.jobtitle}<h3>`;
		let jobComp = `<h4>${job.company}<h4>`;

		let jobDesc = `<p class="jobDesc">${job.snippet}<p>`
		console.log(job.url)
		let jobUrl = `<a href ${job.url}>website</a>`
		let jobCard = $(`<div class="jobCard-container">`).append(jobTitle, jobComp, jobDesc, jobUrl)


	// 	// Print Card
		$('.cardsContainer').append(jobCard);
	})
};
$(indeedApp.init);


// class JobCard {
// 	constructor(jobTitle, jobDesc) {
// 		this.jobTitle = jobTitle;
// 		this.jobDesc = jobDesc;
// 	}
// 	print() {
// 		let jobCard = $(`<div class="jobCard-container">`).append(`<h3>${this.jobTitle}<h3><p>${this.jobDesc}<p>`);
// 		$('.cardsContainer').append(jobCard);
// 	}
// }
// indeedApp.displayJobs  = function(jobs) {
// 		jobs.forEach(function(job) {
// 			const card = new JobCard(job.jobtitle, job.snippet);
// 			card.print();
// 		})
// }

