var interfaces_list = [
	"land",
	"north",
	"east",
	"south",
	"west",
	"sea",
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

var failed_link_checks = 0;
var total_links = 0;


function build_map_data(map_data) {

		var raw_details = raw_details_data;
	
		var raw_links = raw_links_data;


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
		number 		: num_d,
		type 		: type_d,
		supply 		: supply_present,
		owner 		: supply_d,
		access : {
			land	: false,
			sea		: false,
			north	: false,
			south	: false,
			east	: false,
			west	: false,
		},
		links : {},
	};
	//console.log("Adding territory "+num_d+": "+long_d+" to map data");
	//console.log(template);
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
		//console.log("Assembling Links for "+map_data[territory].longname)
		//identify, turn on, and initialise the connection interface
		var interface = the_links[1];
		//console.log("Territories accessible"+interface_text(interface));
		map_data[territory].access[interface] = true;
		map_data[territory].links[interface] = [];
		//console.log("Entire Link List");
		//console.log(the_links);
		for (var link = 2; link < the_links.length; link++) {
			map_data[territory].links[interface].push(the_links[link]);
			var connection = interface_text(interface);
			total_links++;
			//console.log("Territory "+territory+": "+map_data[territory].shortname + " connected to "
			//	+ "Territory "+the_links[link]+": "+map_data[linked_territory(the_links[link])].longname + connection);
		}
	});
};

function linked_territory( link_number) {
	var corrected_link = link_number;
	if (link_number > 9999) {
		corrected_link = Math.floor(link_number/100);
		//console.log("Adjusted raw "+link_number+" to "+corrected_link);
		};
	return corrected_link;
}

function linked_coast (link_number) {
	if (link_number > 9999) {
		coast_number = link_number % 10;
		switch (coast_number) {
			case 1 : return interfaces_list[1]; break;
			case 2 : return interfaces_list[2]; break;
			case 3 : return interfaces_list[3]; break;
			case 4 : return interfaces_list[4]; break;
			default : console.log("ERROR: link number "+ link_number+" appears to encode coast, invalid response");
					return "ERROR";
		}
	} else { return "invalid"; };
}

function encode_coast(territory, coast) {
	switch (coast) {
		case interfaces_list[0] : return territory; break; //land
		case interfaces_list[1] : return (territory * 100 + 1); break;
		case interfaces_list[2] : return (territory * 100 + 2); break;
		case interfaces_list[3] : return (territory * 100 + 3); break;
		case interfaces_list[4] : return (territory * 100 + 4); break;
		case interfaces_list[5] : return territory; break; // sea

	}
}

function validate_territory(map_data, territory_data) {
	var territory_number = territory_data.number;
	//console.log("Validating territory "+territory_number+": "+map_data[territory_number].shortname);
	//console.log(map_data[territory_number].longname + " " + map_data[territory_number].region);
	//console.log(map_data[territory_number].type + " in " + map_data[territory_number].zone)
	if (map_data[territory_number].supply) {
		if (map_data[territory_number].owner == "Neutral") {
	//		console.log("A Neutral supply centre");
		} else {
	//		console.log("Supply owned by " + map_data[territory_number].owner);
		}
	} else {
	//	console.log(map_data[territory_number].owner +" supply present");
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
						interface,
						link_target,
						map_data
					));
					
				} else {
					//ERROR
					console.log(
						"ERROR: Territory "+territory_number+": "+
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
						"ERROR: Territory "+territory_number+": "+
						map_data[territory_number].shortname + " has a links interface for "
						+interface+ " but access is FALSE!!");
					console.log(map_data[territory_number])
				} //end secondary else
			}; //end primary else
		} //end function
	);
};

function valid_link (map_data, raw_origin_number, raw_origin_interface, raw_target_number, raw_target_interface = "invalid") {
	var validity = false;
	
	var target_interface = "invalid";
	if (raw_target_interface == "invalid") {
		target_interface = linked_coast(raw_target_number);
	} else {
		target_interface = raw_target_interface;
	}
	var target_number = linked_territory(raw_target_number);

	var origin_interface = "invalid";
	if (raw_origin_interface == "invalid") {
		origin_interface = linked_coast(raw_origin_number);
	} else {
		origin_interface = raw_origin_interface;
	}
	var origin_number = linked_territory(raw_origin_number);

	//console.log(origin_number+" "+origin_interface+" "+raw_target_number+" "+ raw_target_interface);
	//console.log("Checking connection between Territory "+ origin_number + ": "+map_data[origin_number].shortname+" / "+origin_interface+" and Territory "+ target_number + ": "+map_data[target_number].shortname+ " / "+target_interface);
	if ((origin_interface != interfaces_list[0]) && (target_interface == "invalid") && (target_number < 1000)) { 
			console.log("ERROR: This link appears to be between a sea interface and a land address!");
		}
	if ((target_interface == "invalid") && (target_number >999) && (map_data[territory_number].links.hasOwnProperty(interfaces_list[5])) ) { target_interface = interfaces_list[5]};
	if ((target_interface == "invalid") && (target_number <1000) && (map_data[territory_number].links.hasOwnProperty(interfaces_list[0])) ) { target_interface = interfaces_list[0]};
	//console.log(map_data[origin_number]);
	//console.log(map_data[target_number]);
	if (map_data[origin_number].links[origin_interface].includes(encode_coast(target_number, target_interface))) {
	//	console.log("Valid link found from "+map_data[origin_number].shortname+interface_text(origin_interface)+" to "+map_data[target_number].shortname+interface_text(target_interface));
		validity = true;
	}//valid
	else {  //invalid
		console.log("INVALID LINK FROM "+origin_number+ " / "+origin_interface+ " TO " + target_number + " / "+target_interface);
		console.log(map_data[origin_number]);
		console.log(map_data[target_number]);
		console.log("Failed Links at last count: "+failed_link_checks+" out of "+total_links);
	}; 
	return validity;
};

function reciprocal_link_test( link_origin, origin_interface, link_target, map_data ) {
	var reciprocal_link_found = false;
	//iterate through all interfaces valid in link_target
	// if it's a land, check land
	// if it's a sea or coast, check if the target exceeds 
	var target_interface = linked_coast(link_target);
	if ((target_interface == "invalid") &&(origin_interface == interfaces_list[0])) {target_interface = origin_interface};
	if ((target_interface == "invalid") &&(origin_interface != interfaces_list[0])) {target_interface = interfaces_list[5]};
	if (valid_link(map_data, link_target, target_interface, link_origin, origin_interface)) {

	} else {
		failed_link_checks++;

	//console.log(link_origin+" "+origin_interface+" "+link_target+" "+ target_interface);
		console.log (
			"ERROR: No link from Territory "+ link_target + ": "+map_data[linked_territory(link_target)].shortname+interface_text(target_interface)
			+ " was found back to Territory "+link_origin+": "+map_data[link_origin].longname + interface_text(origin_interface)
			);
	}



};

function interface_text (interface) {
	switch (interface) {
		case interfaces_list[0] : var connection = " by land"; break;
		case interfaces_list[5] : var connection = " by sea"; break;
		case interfaces_list[1] : var connection = " along its north coast"; break;
		case interfaces_list[3] : var connection = " along its south coast"; break;
		case interfaces_list[2] : var connection = " along its east coast"; break;
		case interfaces_list[4] : var connection = " along its west coast"; break;
		default : var connection = " and (ERROR!) dear god something is wrong!!";
	};
	return connection;
}
