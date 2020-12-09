var interfaces_list = [
	"land",
	"north",
	"east",
	"south",
	"west",
	"sea",
];

var maxrounds = 7;

function power_colour(power_name) {
		switch (power_name) {
		case powers_list[0] : return "#991E12"; break;
		case powers_list[1] : return "#9E591F"; break;
		case powers_list[2] : return "#9B35A5"; break;
		case powers_list[3] : return "#2354A2"; break;
		case powers_list[4] : return "#D78243"; break;
		case powers_list[5] : return "#5E29A3"; break;
		case powers_list[6] : return "#A7A835"; break;
		case powers_list[7] : return "#4AA6A8"; break;
		case powers_list[8] : return "#A43A6E"; break;
		case powers_list[9] : return "#4BA52F"; break;
		default 			: return -1; console.log("ERROR: Invalid Power Lookup for "+power_name);
	}


};

function interface_index (interface) {
	switch (interface) {
		case interfaces_list[0] : return 0;
		case interfaces_list[1] : return 1;
		case interfaces_list[2] : return 2;
		case interfaces_list[3] : return 3;
		case interfaces_list[4] : return 4;
		case interfaces_list[5] : return 5;
		default: console.log ("I_I failed: "+interface); return -1;
	}
}

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

var chart_turns_data = [];
var chart_enemies_data = [];
var chart_radar=[];

function is_enemy (power_name, territory) {
	//console.log("IS_E "+power_name+" "+territory);
	var enemy_found = false;
	powers_list.forEach ( function (enemy, id) {

		if (enemy != power_name) {
			var nominal_results = starting_units(enemy, territory);

			if (nominal_results) {
				enemy_found = true; 
				//console.log(power_name+"'s enemy was found in "+map_data[territory].longname)
			}
			//console.log("I_E NR "+nominal_results+" "+enemy_found);
		}
	})
	//console.log(enemy_found);
	return enemy_found;
}

function starting_units (power_name, territory)
{
	//console.log ("SU Power: "+power_name+" Territory: "+territory);
	switch (power_name) {
		case powers_list[0] : switch (territory) {
		//Crown
		case 118 : return "land"; break;
		case 163 : return "sea"; break;
		case 130 : return "land" ; break;
		case 136 : return "land"; break;
		case 137 : return "land"; break;
		case 182 : return "sea"; break;
		case 414 : return "sea"; break;
	}; break; 
		case powers_list[1] : switch (territory) 
	{//Cumberland
		case 120 : return  "land"; break;
		case 154 : return  "sea"; break;
		case 159 : return  "land"; break;
		case 172 : return  "north"; break;
		case 174 : return  "land"; break;
		case 175 : return "land"; break;
		case 416 : return "land"; break;
	}; break; 
		case powers_list[2] : switch (territory) 
	{//Newcastle
		case 141 : return  "land"; break;
		case 145 : return  "sea"; break;
		case 157 : return  "land"; break;
		case 187 : return  "land"; break;
		case 189 : return  "land"; break;
		case 199 : return "sea"; break;
		case 413 : return "sea"; break;
	}; break; 
		case powers_list[3] : switch (territory) 
	{//Montrose
		case 237 : return "sea"; break;
		case 240 : return  "land"; break;
		case 242 : return  "land"; break;
		case 250 : return "sea"; break;
		case 251 : return "west"; break;
		case 258 : return  "land"; break;
		case 417 : return "sea"; break;

	}; break; 
		case powers_list[4] : switch (territory) 
	{//Ormond
		case 308 : return  "land"; break;
		case 310 : return "sea"; break;
		case 341 : return  "land"; break;
		case 328 : return  "land"; break;
		case 338 : return  "sea"; break;
		case 333 : return "land"; break;
		case 411 : return "land"; break;
	}; break; 
		case powers_list[5] : switch (territory) 
	{//Protectorate
		case 111 : return  "land"; break;
		case 115 : return   "sea"; break;
		case 128 : return   "sea"; break;
		case 133 : return   "land"; break;
		case 114 : return   "land"; break;
		case 178 : return  "land"; break;
		case 418 : return  "sea"; break;
	}; break; 
		case powers_list[6] : switch (territory) 
	{//Manchester
		case 105 : return  "land"; break;
		case 106 : return  "land"; break;
		case 193 : return  "land"; break;
		case 194 : return  "land"; break;
		case 195 : return "sea"; break;
		case 196 : return "sea"; break;
		case 412 : return "sea"; break;
	}; break; 
		case powers_list[7] : switch (territory) 
	{//Argyll
		case 214 : return "land"; break;
		case 223 : return "land"; break;
		case 260 : return "sea"; break;
		case 263 : return "land"; break;
		case 336 : return "sea"; break;
		case 337 : return "sea"; break;
		case 410 : return "sea"; break;
	}; break; 
		case powers_list[8] : switch (territory) 
	{//Hamilton
		case 207 : return "land"; break;
		case 209 : return "sea"; break;
		case 211 : return "sea"; break;
		case 212 : return "land"; break;
		case 219 : return  "land"; break;
		case 267 : return "sea"; break;
		case 419 : return "sea"; break;
	}; break; 
		case powers_list[9] : switch (territory) 
	{//Confederacy
		case 332 : return "sea"; break;
		case 320 : return "land"; break;
		case 322 : return "sea"; break;
		case 324 : return "land"; break;
		case 329 : return "land"; break;
		case 339 : return "land"; break;
		case 415 : return "land"; break;
	}; break; };

};

var failed_link_checks = 0;
var total_links = 0;

function add_power (power_data, power_name) {
	var power_template = {
		start 		: []	, //initial supply
		distance 	: 0.0		, //following all links, how many hops to 55
		exposure	: [0,0]	, //% of SCs in 3 and 5 spaces which are enemy owned
		number 		: power_lookup(power_name)	, //power index
		scoring 	: {}	, //uses scoring template
		mapping 	: {}	, //uses mapping template
	};
	power_data[power_name]=power_template;
}

function power_lookup (power_name) {
	switch (power_name) {
		case powers_list[0] : return 0; break;
		case powers_list[1] : return 1; break;
		case powers_list[2] : return 2; break;
		case powers_list[3] : return 3; break;
		case powers_list[4] : return 4; break;
		case powers_list[5] : return 5; break;
		case powers_list[6] : return 6; break;
		case powers_list[7] : return 7; break;
		case powers_list[8] : return 8; break;
		case powers_list[9] : return 9; break;
		default 			: return -1; console.log("ERROR: Invalid Power Lookup for "+power_name);
	}
};

function build_core_data(map_data, power_data) {

		var raw_details = raw_details_data;
	
		var raw_links = raw_links_data;


		powers_list.forEach(
			selected_power => add_power(power_data, selected_power)
			)


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
				power_data
			));
			//console.log(power_data);	

	//push the links data into map_data
		add_links(map_data, raw_links);
		analyse_powers(power_data, map_data);

	};
function is_sea (interface) {
	//console.log("I_S: "+interface);
	var interface_number = interface_index(interface);
	switch (interface_number) {
		case 0 : return false; break;
		case 1 : return true; break;
		case 2 : return true; break;
		case 3 : return true; break;
		case 4 : return true; break;
		case 5 : return true; break;
		default: console.log("strangeness in sea validation"); return false;
	}
}

function rebuild_link (link, interface) {
	var returned_link = 0;
	if (linked_coast(link) == "invalid") {
		//console.log ("INV LC: "+linked_coast(link)+" IF: "+interface+" Link: "+link);
		returned_link = encode_coast(linked_territory(link), interface, true);
	} else {
		//console.log ("VLD LC: "+linked_coast(link)+" IF: "+interface+" Link: "+link);
		returned_link = link;
	}
	//console.log("RL: "+returned_link);
	return returned_link;
};

function html_to_rgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function build_select_data(map_data, power_data){
	var data = {
		"results": [
			{
				"text" : "England", 
				"children" : [],

			},
			{
				"text" : "Wales", 
				"children" : [],

			},
			{
				"text" : "Scotland", 
				"children" : [],

			},
			{
				"text" : "Ireland", 
				"children" : [],

			},
			{
				"text" : "Continent", 
				"children" : [],

			},
			{
				"text" : "Ocean", 
				"children" : [],

			},
		],
		"pagination" : {
			"more":true
		}
	}//end declaration
	map_data.forEach( function (territory, id){
		var datum = {
			"id" 	: territory.number,
			"text" 	: territory.longname
		}
		switch (territory.zone) {
			case "England" 		: data["results"][0].children.push(datum); break;
			case "Wales" 		: data["results"][1].children.push(datum); break;
			case "Scotland" 	: data["results"][2].children.push(datum); break;
			case "Ireland" 		: data["results"][3].children.push(datum); break;
			case "Continent" 	: data["results"][4].children.push(datum); break;
			case "Ocean" 		: data["results"][5].children.push(datum); break;
		}//end switch
	});//end foreach
	//console.log("select data");
	//console.log(data);
	return data;
};//end function

function analyse_powers(power_data, map_data) {
	var power_map = {};
	var supply_scoring_template = { //per SC data structure
		id 			: 0, //territory id
		distance	: 0, //on which round was it encounterd
		owner 		: "Neutral", //is it owned?
		positive	: 0, //points added based on encounter
		negative	: 0, //points to subtract based on others' encounter
	};



	powers_list.forEach( function (power_name, power_id) {	//for each power, 
		var power_map_template = {
		processed 	: [], //list of scored territories (SCs or not) NO INTERFACES
		landscape 	: [], //array by round of SCs using scoring data structure NO INTERFACES
		enemy 	 	: [],
		next 		: [], //queue for next round FULL INTERFACES
		};
		//console.log("Starting "+power_name);
		chart_turns_data[power_lookup(power_name)] = {
			data : [0,0,0,0,0,0,0],
			label : power_name,
			borderColor : power_colour(power_name),
			fill: false,
		};
		chart_enemies_data[power_lookup(power_name)] = {
			data : [0,0,0,0,0,0,0],
			label : power_name,
			indexAxis: "y",
			borderColor : power_colour(power_name),
			backgroundColor : "rgba("+html_to_rgb(power_colour(power_name)).r+", "+html_to_rgb(power_colour(power_name)).g+", "+html_to_rgb(power_colour(power_name)).b+", 1)",
			fill: true,
		};
		chart_radar[power_id]= {
  			type: 'radar',
  			data: {
    			labels: [1,2,3,4,5,6,7],
    			datasets: [{
					data : [0,0,0,0,0,0,0],
					label : power_name,
					borderColor : power_colour(power_name),
					backgroundColor : "rgba("+html_to_rgb(power_colour(power_name)).r+", "+html_to_rgb(power_colour(power_name)).g+", "+html_to_rgb(power_colour(power_name)).b+", 0.1)",
					fill: true
				},],
  			},
  			options: {
    			scale: {
        			angleLines: {
            			display: true
        			},
        			ticks: {
            			suggestedMin: 25,
            			suggestedMax: 25
        			}
    			},
  				responsive : false,
  				legend : {
  					display : true,
//  					position : "right",
  				},
    			title: {
      				display: false,
      				text: power_name, //powers_list
    			},
    			tooltips: {
                	enabled: true,
                	callbacks: {
                    	label: function(tooltipItem, data) {
                        	return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    	}
                	}
            	}
  			}
		};
	
		power_data[power_name].start.forEach( function (territory_id, t_key) {	//for each starting location, //
			var current_interface = starting_units(power_name,territory_id);
			power_map_template.processed.push(territory_id);
			//console.log( "T ID : "+territory_id+" & C IF: "+current_interface);
			//console.log(map_data[territory_id].links[current_interface]);
			//if (power_name == "Ormond") {
			//	console.log(territory_id+" "+current_interface);
			//	console.log(map_data[territory_id].links);
			//}
			map_data[territory_id].links[current_interface].forEach ( 
				starting_link => power_map_template.next.push(rebuild_link(starting_link, current_interface)) ); //for each link in the appropriate interface, add to the hopper
			//console.log("At the start, we're adding this interface-encoded territory to the processed list: "+ map_data[territory_id].longname);
			//console.log(power_map_template.processed);
		}); //at this point we've preseeded the next and processed hoppers

			for (var scoring_round = 1; scoring_round <=maxrounds; scoring_round++) {//each radius
				//console.log("Round "+scoring_round+" starts");
				//			console.log(power_map_template);
				power_map_template.landscape[scoring_round]=[];
				power_map_template.enemy[scoring_round]=[];
				var next_round = [];
				//console(power_map_template.next);
				power_map_template.next.forEach ( //for each link in the next round
					next_link => analysis_round(next_link, map_data, power_map_template, power_data, next_round, scoring_round, power_name)) ; //end for each link in hopper


				next_round.forEach (add_link => power_map_template.next.push(add_link));
				chart_turns_data[power_lookup(power_name)].data[(scoring_round-1)]=power_map_template.landscape[scoring_round].length+1;
				chart_enemies_data[power_lookup(power_name)].data[(scoring_round-1)] = power_map_template.enemy[scoring_round].length+1;
				if (scoring_round > 1) {
					chart_turns_data[power_lookup(power_name)].data[(scoring_round-1)] += chart_turns_data[power_lookup(power_name)].data[(scoring_round-2)];
					chart_enemies_data[power_lookup(power_name)].data[(scoring_round-1)] += chart_enemies_data[power_lookup(power_name)].data[(scoring_round-2)];
					};
				chart_radar[power_id].data.datasets[0].data[scoring_round-1]=power_map_template.landscape[scoring_round].length-power_map_template.enemy[scoring_round].length;
				//console.log(chart_turns_data);

			//	console.log("Round "+scoring_round+" ends");
			}//end processing rounds
			//console.log(power_map_template);
			power_map[power_name]=power_map_template;


	}//end power
	);

	//follow each link
	//		if (map_data[territory_id].supply) {
	//			supply_scoring_template.id=territory_id;
	//			power_data[power_name].scoring.push(supply_scoring_template);
	//		}; 
	//if SC, add territory to radius unless already added
	//console.log("The final power map.");
	//	console.log(power_map);

};

function analysis_round(next_link, map_data, power_template, power_data, next_round, scoring_round, power_name) {
					//break down linked format information
					var next_id = linked_territory(next_link);
					var next_interface = linked_coast(next_link);
					var enemies_found_here = 0;
					if (scoring_round > 1) {chart_enemies_data[power_lookup(power_name)].data[(scoring_round -1)] += chart_enemies_data[power_lookup(power_name)].data[(scoring_round-2)] }
					//var next_round = [];
					if (next_interface == "invalid") {console.log("Encoding approaches have failed for "+next_id)};
					//check if processed already
						//console.log("Territory: "+next_link);
						var repeat_territory = power_template.processed.includes(linked_territory(next_link));

						if (!(repeat_territory)) {

							if (map_data[next_id].supply) {//if SC, add to landscape
								power_template.landscape[scoring_round].push(next_id);
								if (is_enemy(power_name,next_id)) {
									//console.log("A R: "+next_id);
									power_template.enemy[scoring_round].push(next_id);
				
								};
								//console.log("On round "+scoring_round+", a supply centre was encountered at "+map_data[next_id].longname);
								//console.log(power_template);
							};
														//mark this territory as processed
							power_template.processed.push(next_id);
							//add this territory's links
							//iterate through this territory's interfaces
							var all_interfaces = Object.keys(map_data[next_id].links);
							var interface_links = Object.values(map_data[next_id].links);
							//console.log(all_interfaces);
							//console.log(interface_links);
							for (const new_interface of all_interfaces) {
								if (is_sea(new_interface) == is_sea(next_interface)) {
									map_data[next_id].links[new_interface].forEach (
										new_link => next_round.push(rebuild_link(new_link, new_interface))
										)
								}; //end if								
							};


						} //end if

							
					};
	


function add_territory (map_data, num_d, short_d, long_d, reg_d, zone_d, type_d, supply_d, power_data) {
	var supply_present = false;
	switch (supply_d) {
		case "No" : supply_present = false; break;
		case "Neutral" :  supply_present = true; break;
		case powers_list[0] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[1] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[2] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[3] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[4] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[5] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[6] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[7] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[8] : power_data[supply_d].start.push(num_d); supply_present = true; break;
		case powers_list[9] : power_data[supply_d].start.push(num_d); supply_present = true; break;
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
		value : {
			Crown			: 0,
			Cumberland		: 0,
			Newcastle		: 0,
			Montrose		: 0,
			Ormond			: 0,
			Protectorate	: 0,
			Manchester		: 0,
			Argyll			: 0,
			Hamilton		: 0,
			Confederacy		: 0,
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
			case 0 : return interfaces_list[1]; break;
			case 1 : return interfaces_list[1]; break;
			case 2 : return interfaces_list[2]; break;
			case 3 : return interfaces_list[3]; break;
			case 4 : return interfaces_list[4]; break;
			case 5 : return interfaces_list[1]; break;
			default : console.log("ERROR: link number "+ link_number+" appears to encode coast, invalid response");
					return "ERROR";
		}
	} else { return "invalid"; };
}

function encode_coast(territory, coast, analyse_mode = false) {
	//console.log("EC, T: "+territory+" C: "+coast+" AL: "+analyse_mode);
	switch (coast) {
		case interfaces_list[0] : if (analyse_mode) {return (territory * 100)} else {return territory}; break; //land
		case interfaces_list[1] : return (territory * 100 + 1); break;
		case interfaces_list[2] : return (territory * 100 + 2); break;
		case interfaces_list[3] : return (territory * 100 + 3); break;
		case interfaces_list[4] : return (territory * 100 + 4); break;
		case interfaces_list[5] : if (analyse_mode) {return (territory * 100 + 5)} else {return territory}; break; // sea

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
};


