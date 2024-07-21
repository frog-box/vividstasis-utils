document.getElementById('input-cc').addEventListener('blur', function(e) {
	let value = e.target.value.replace(/'/g, '');
	if (!isNaN(value) && value !== '') {
		if (value > 15.9) {value = 15.9;}
		if (value < 0) {value = 0;}
		value = Math.floor(value*10)/10;
	}

	showRatingscore();
});
document.getElementById('input-score').addEventListener('blur', function(e) {
	let value = e.target.value.replace(/'/g, '');
	if (value > 1010000) {value = 1010000;}
	if (value < 0) {value = 0;}
	value = Math.floor(value);
	if (!isNaN(value) && value !== '') {
		e.target.value = Number(value).toLocaleString('en').replace(/,/g, "'");
	}

	showRatingscore();
});

document.getElementById('input-score').addEventListener('focus', function(e) {
    const value = parseInt(e.target.value.replace(/'/g, ''), 10);
    e.target.value = isNaN(value) ? '' : value;
});

document.addEventListener('DOMContentLoaded', function() {
	const radioGroup = document.getElementById('cleartype');
	const radios = radioGroup.querySelectorAll('input[type="radio"]');

	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			if (this.checked) {
				showRatingscore();
			}
		});
	});
});

function showRatingscore() {
	var score = parseInt(document.getElementById('input-score').value.replace(/'/g,''),10);
	var cc = Number(document.getElementById('input-cc').value);
	var clear = document.querySelector('input[name="clear"]:checked').value;
	console.log(clear);
	clear = clear === "FC" ? 250 : clear === "AC" ? 500 : 0;
	console.log(clear);
	if ((score >= 0 && score <= 1010000 && score != "") && (cc >= 0.0 && cc <= 15.9 && cc != "")) {
		document.getElementById('ratingdisplay').style['visibility'] = 'visible';


		var ratingscore = cc*1000;
		if (score >= 1008000) {ratingscore += 2000;}
		else if (score >= 1000000) {ratingscore += (score/16)-61000;}
		else if (score >= 980000) {ratingscore += (score/40)-23500;}
		else if (score >= 950000) {ratingscore += (score/30)-95000/3;}
		else if (score >= 600000) {ratingscore += (score/50)-19000;}
		else {ratingscore = 0;}

		ratingscore += clear;

		document.getElementById('ratingscore').textContent = Math.round(ratingscore);
		document.getElementById('ratingscore_raw').textContent = "("+ratingscore.toFixed(2)+")";
	}
}