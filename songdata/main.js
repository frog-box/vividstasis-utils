function toggle_en(checkbox) {
	document.querySelectorAll("#en-stats input[type='text']").forEach(function(input) {
		if (checkbox.checked) {
			input.disabled = false;
			document.querySelector("#en-text").style.color = "#000";
		} else {
			input.disabled = true;
			input.value = "";
			resize(input);
			document.querySelector("#en-text").style.color = "#6d6d6d";
		}
	});
}
toggle_en(document.querySelector("#en-toggle"));

function toggle_shop(input) {
	var shop_price = document.getElementById("shop-price");
	if (input.value === "SHOP") {
		shop_price.style.display = "inline-block";
		resize(shop_price);
	} else {
		shop_price.style.display = "none";
		shop_price.value = "";
	}
}

function resize(input) {
	const default_width = input.getAttribute("default-width");
	input.style.width = Math.max(default_width, input.value.length)+"ch";
}
document.querySelectorAll('.expand').forEach(input => {
	input.style.width = input.getAttribute("default-width")+"ch";
	input.addEventListener("input", () => resize(input));
})

function get(strings, ...values) {
	return strings.reduce((result, str, i) => {
		const value = values[i];
		const element = document.getElementById(value);
		const content = element ? element.value : '';
		return result + str + content;
	}, '');
}

function update_output(out) {
	var header = get`\t\t['${"song"}'] = {\n\t\t\t`;
	var title = "";
	if (get`${"alt-title"}` !== "") {
		title = get`title = '${"alt-title"}',\n\t\t\t`
	}
	var metadata = get`pack = '${"pack"}',
			artist = '${"artist"}',
			bpm = ${"bpm"},
			length = '${"length"}',
			illustrator = '${"illust"}',\n\t\t\t`;

	var main_diffs = get`opening = {${"op-cc"}, '${"op-charter"}', ${"op-notes"}, ${"op-chip"}, ${"op-tech"}, ${"op-strm"}, ${"op-chrd"}, ${"op-brst"}},
			middle = {${"md-cc"}, '${"md-charter"}', ${"md-notes"}, ${"md-chip"}, ${"md-tech"}, ${"md-strm"}, ${"md-chrd"}, ${"md-brst"}},
			finale = {${"fn-cc"}, '${"fn-charter"}', ${"fn-notes"}, ${"fn-chip"}, ${"fn-tech"}, ${"fn-strm"}, ${"fn-chrd"}, ${"fn-brst"}},\n\t\t\t`;
	var encore = "";
	if (document.getElementById("en-toggle").checked) {
		encore = get`encore = {${"en-cc"}, '${"en-charter"}', ${"en-notes"}, ${"en-chip"}, ${"en-tech"}, ${"en-strm"}, ${"en-chrd"}, ${"en-brst"}},\n\t\t\t`;
	}

	if (get`${"unlock"}` == "SHOP") {
		var unlock = get`unlock = SHOP(${"shop-price"}),\n\t\t\t`;
	} else {
		var unlock = get`unlock = ${"unlock"},\n\t\t\t`;
	}

	if (get`${"en-ver"}` !== "")
		var ver = get`version = ['${"ver"}', '${"en-ver"}']`;
	else
		var ver = get`version = '${"ver"}'`;

	var footer = "\n\t\t}";

	out.value = header + title + metadata + main_diffs + encore + unlock + ver + footer;
}
document.getElementById("data").addEventListener("input", function(event) {
	update_output(document.querySelector("#output textarea"));
})

document.getElementById("copy").addEventListener("click", function() {
	const text = document.getElementById("output-area");
	text.select();
	text.setSelectionRange(0, 16384);
	document.execCommand("copy");
	alert("Copied:\n" + text.value);
})