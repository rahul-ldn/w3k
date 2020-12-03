var interfaces_list = [
	"land",
	"sea",
	"north",
	"south",
	"east",
	"west",
];

var powers_list = [
	"Crown",
	"Cumberland",
	"Newcastle" ,
	"Montrose" ,
	"Ormond" ,
	"Protectorate" ,
	"Manchester" ,
	"Argyll" ,
	"Hamilton" ,
	"Confederacy",
];
function build_map_data(map_data) {


		//Papaparse details
		var raw_details = [];
		Papa.parse("w3k.territory-details.csv", {
		download: true,
		complete: function(details, file) {
			console.log("Parsing complete:", details, file);
			raw_details = details;
			},
		skipEmptyLines : true,

		});
		console.log("Results");
		console.log(raw_details);
		//papaparse links
		var raw_links = [];
		Papa.parse("w3k.territory-links.csv", {
		download: true,
		complete: function(links, file) {
			console.log("Parsing complete:", links, file);
			raw_links = links;
			},
		skipEmptyLines : true,

		});
		console.log("Results");
		console.log(raw_links);

	//for each record in raw_details
	//push details data into map_data
		raw_details.forEach( 
			territory => add_territory(map_data,
				territory[0], //number
				territory[1], //short
				territory[2], //long
				territory[3], //region
				territory[4], //zone
				territory[5], //type
				territory[6], //supply
			));
		

	//push the links data into map_data
		add_links(map_data, raw_links)

	};

	


function add_territory (map_data, num_d, short_d, long_d, reg_d, zone_d, type_d, supply_d) {
	var supply_present = false;
	switch (supply_d) {
		case "No" : supply_present = false; break;
		case "Neutral" :  supply_present = true; break;
		case powers_list[0] : supply_present = true; break;
		case powers_list[1] : supply_present = true; break;
		case powers_list[2] : supply_present = true; break;
		case powers_list[3] : supply_present = true; break;
		case powers_list[4] : supply_present = true; break;
		case powers_list[5] : supply_present = true; break;
		case powers_list[6] : supply_present = true; break;
		case powers_list[7] : supply_present = true; break;
		case powers_list[8] : supply_present = true; break;
		case powers_list[9] : supply_present = true; break;
		default :  supply_present = false; supply_d = "ERROR!"; 

	}
	var template = {
		shortname 	: short_d,
		longname 	: long_d,
		region 		: reg_d,
		zone 		: zone_d,
//		number 		: "number" IS KEY
		type 		: type_d
		supply 		: supply_present,
		owner 		: supply_d
		access : {
			land	: false,
			sea		: false,
			north	: false,
			south	: false,
			east	: false,
			west	: false,
		}
		links : {},
	};
	console.log("Adding territory "+num_d+": "+long_d+" to map data");
	console.log(template);
	//add template to map_data
	map_data[num_d] = template;

};

function add_links (map_data, link_data) {
	//link_data are all the rows
	//the_links are a specific row
	//links_num is the index of that row
	// link is a particular connection
	link_data.forEach( function (the_links, links_num) {
		//identify the territory number
		var territory = the_links[0];
		//identify, turn on, and initialise the connection interface
		var interface = the_links[1];
		map_data[territory].access[interface] = true;
		map_data[territory].links[interface] = [];
		for (var link = 2; link < the_links.length; links++) {
			map_data[territory].links[interface].push(the_links[link]);
			var connection = interface_text(interface);
			console.log(map_data[territory].shortname + " connected to "
				+ map_data[the_links[link]].longnamec + connection);
		}
	});
};

function validate_territory(map_data, territory_number) {
	console.log("Validating territory "+territory_number+": "+map_data[territory_number].shortname);
	//console.log(map_data[territory_number].longname + " " + map_data[territory_number].region);
	//console.log(map_data[territory_number].type + " in " + map_data[territory_number].zone)
	if (map_data[territory_number].supply) {
		if (map_data[territory_number].owner == "Neutral") {
			console.log("A Neutral supply centre");
		} else {
			console.log("Supply owned by " + map_data[territory_number].owner);
		}
	} else {
		console.log(map_data[territory_number].owner +" supply present");
	};

// for each access entry
	interfaces_list.forEach( 
		function (interface, inum) {
			if (map_data[territory_number].access[interface]) {
				//if interface should exist, check
				if (map_data[territory_number].links.hasOwnProperty(interface)) {
				//if true loop through links
					map_data[territory_number].links[interface].forEach( 
						link_target => reciprocal_link_test(
						territory_number, 
						link_target,
						map_data
					));
					
				} else {
					//ERROR
					console.log(
						"ERROR: Territory "+territory_number+": "
						map_data[territory_number].shortname + " has valid access for "
						+interface+ " but no links interface!!");
					console.log(map_data[territory_number])
				};
			} else { //end primary if, start primary else
				//then interface should _not_ exist
				if (!(map_data[territory_number].links.hasOwnProperty(interface))) {
					//it doesn't
				} else {
					//ERROR
					console.log(
						"ERROR: Territory "+territory_number+": "
						map_data[territory_number].shortname + " has a links interface for "
						+interface+ " but access is FALSE!!");
					console.log(map_data[territory_number])
				} //end secondary else
			}; //end primary else
		} //end function
	);
};

function reciprocal_link_test( link_origin, link_target, map_data ) {
	var reciprocal_link_found = false;
	//iterate through all interfaces valid in link_target
	Object.keys(map_data[link_target].links).forEach(
			function (interface, inum) {
				if (map_data[link_target].links[interface].includes(link_origin)) {
					console.log(
						"Territory "+link_origin+": "+map_data[link_origin].shortname
						+" has a valid bidirectional link to "+
						map_data[link_target].longname+interface_text(interface)
						);
					reciprocal_link_found = true;
				}
			}
		); //end interface loop
	if (!(reciprocal_link_found)) {
		console.log (
			"ERROR: No link from Territory "+ link_target + ": "map_data[link_target].shortname
			+ " was found back to Territory "+link_origin+": "+map_data[link_origin].longname 
			)
	}
};

function interface_text (interface) {
	switch (interface) {
		case "land" : var connection = " by land"; break;
		case "sea" : var connection = " by sea"; break;
		case "north" : var connection = " along its north coast"; break;
		case "south" : var connection = " along its south coast"; break;
		case "east" : var connection = " along its east coast"; break;
		case "west" : var connection = " along its west coast"; break;
		default : var connection = " and (ERROR!) dear god something is wrong!!";
	};
}
