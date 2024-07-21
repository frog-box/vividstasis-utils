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

function addImage(first_image) {
	var container = document.createElement("div");
	container.classList.add("image-item");

	var children = [
		{
			type: "text",
			class: "image-ver expand",
			placeholder: "ver",
			"default-width": 3
		},
		{
			type: "text",
			class: "image-path expand",
			placeholder: "image",
			"default-width": 9
		},
		{
			type: "text",
			class: "image-illust expand",
			placeholder: "illust",
			"default-width": 6
		}
	];
	if (first_image)
	{
		children[1]["id"] = "image";
		children[2]["id"] = "illust";
	}

	children.forEach((child) => {
		var element = document.createElement("input");
		Object.keys(child).forEach((key) => {
			element.setAttribute(key, child[key]);
		});
		if (!first_image)
		{
			element.style.width = element.getAttribute("default-width")+"ch";
			element.addEventListener("input", () => resize(element));
		}
		container.appendChild(element);
		container.append("\n");
	});
	document.getElementById("image-list").appendChild(container);
	if (!first_image)
		document.getElementById("image-remove").removeAttribute("disabled");
}
addImage(true);

function removeImage() {
	var list = document.getElementById("image-list");
	list.removeChild(list.lastChild);
	if (list.children.length <= 1)
		document.getElementById("image-remove").setAttribute("disabled", "");
}

function resize(input) {
	const default_width = input.getAttribute("default-width");
	input.style.width = Math.max(default_width, input.value.length)+"ch";
}
document.querySelectorAll('.expand').forEach(input => {
	input.style.width = input.getAttribute("default-width")+"ch";
	input.addEventListener("input", () => resize(input));
});

// For some reason, doing this in html causes the state to not reset when refreshing, at least on firefox, so I'm doing it here.
document.getElementById('image-remove').setAttribute('disabled', '');

function get(strings, ...values) {
	return strings.reduce((result, str, i) => {
		const value = values[i];
		const element = document.getElementById(value);
		const content = element ? element.value : '';
		return result + str + content;
	}, '');
}

function escape_chars(str) {
	var escapes = [
		['\\', '\\\\'],
		['\'', '\\\'']
	];
	var out = str;
	escapes.forEach((escape) => {
		out = out.replace(escape[0], escape[1]);
	});
	return out;
}

function update_output(out) {
	var images = document.getElementById("image-list").children;
	var header = get`\t\t['${"song"}'] = {\n\t\t\t`;
	var title = "";
	if (get`${"alt-title"}` !== "")
		title = get`title = '${"alt-title"}',\n\t\t\t`;
	if (images.length > 1)
	{
		title += 'image = [';
		for (var i = 0; i < images.length; i++)
		{
			var image_element = images[i];
			title += `['${image_element.getElementsByClassName('image-ver')[0].value}', '${image_element.getElementsByClassName('image-path')[0].value}']`;
		}
		title += '],\n\t\t\t';
	}
	else if (get`${"image"}` !== "")
		title += get`image = '${"image"}',\n\t\t\t`;
	var metadata = get`pack = '${"pack"}',
			artist = '${"artist"}',
			bpm = ${"bpm"},
			length = '${"length"}',\n\t\t\t`;
	
	if (images.length === 1)
		metadata += get`illustrator = '${"illust"}',`;
	else
	{
		metadata += 'illustrator = [';
		for (var i = 0; i < images.length; i++)
		{
			var image_element = images[i];
			metadata += `['${image_element.getElementsByClassName('image-ver')[0].value}', '${image_element.getElementsByClassName('image-illust')[0].value}']`;
		}
		metadata += '\n\t\t\t';
	}

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