var num = 10;
var page = 1;

var images = [];
var next = {};
var search = {
		q:'dog',
		searchType:'image'
};

var specificDogs = ["","spaniel","bull","husky","mouse","goose","hound","blue","whisper","ghost","fabric","donut"];

var firstSearch = true;



$.getScript('extras.js', function()
{
    search.cx = your.cx;
});



// setup helper function to append
var push_apply = Function.apply.bind([].push);
var slice_call = Function.call.bind([].slice);

Object.defineProperty(Array.prototype, "pushArrayMembers", {
    value: function() {
        for (var i = 0; i < arguments.length; i++) {
            var to_add = arguments[i];
            for (var n = 0; n < to_add.length; n+=300) {
                push_apply(this, slice_call(to_add, n, n+300));
            }
        }
    }
});



$(document).ready(function(){
	// store audio tag for later
	var bark = $('#bark');

	//testSearch();

});

function SearchCompleted(response){
	console.log("complete:");
	next = response.queries.nextPage[0];

	var nextQuery = $.trim(specificDogs[Math.floor(Math.random()*specificDogs.length)] + search.q);
	if(nextQuery === query){
		next.start = page*num + 1;
	} else {
		query = nextQuery;
		page = 0;
		next.start = page*num + 1;
	}

	next.q = query;


	console.log(next);

	images.pushArrayMembers(response.items);



	if(firstSearch){
		firstSearch = false;
		switchImage(0);
	}
	
}


function switchImage(i){
	setTimeout(function(){
		var width = $(document).width();
		var height = $(document).height();
		// update page image with first link, after a delay get second ... etc
		$('#dog').attr("src",images[i].image.thumbnailLink).css({
			width: width,
			height: 'auto'
		});

		playBark();

		if(i+1 == images.length){ // right now just grow the dog group really slowly i guess (minimize API calls)
			// do another search and add to images
			page++;
			testSearch(next);
		}
		switchImage(Math.floor(Math.random()*images.length));
	},2000);
}

function playBark(){
	var bark = $('#bark');
	bark.trigger('play');
}


function testSearch(searchItems){
	console.log('searching...');

	var url = 'https://www.googleapis.com/customsearch/v1?key=' + your.key;

	var jqxhr = $.getJSON(url, searchItems , SearchCompleted).fail(function(e){console.log(e.responseText)});

}

    