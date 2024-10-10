const canvas = document.getElementById('myCanvas');
canvas.width = 600;
canvas.height = 500;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const el = document.querySelector("#myCanvas")

const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
var dot_positions = []; 
var polygons = [];
var flag_remove_polygon = false;
var flag_change_color = false;
var save_polygon2_changecolor = -1;

el.addEventListener("click", (e) => {

	  const rect = e.target.getBoundingClientRect();
	  
	  const x = Math.floor(e.clientX - rect.left);
	  const y = Math.floor(e.clientY - rect.top);
	  
	  console.log("x: " + x + " - y: " + y);

	  let dot = {
		x: x,
		y: y
	  }

		if (flag_change_color === true){
			save_polygon2_changecolor = find_polygon_by_click(dot);
			change_polygon_color();
			flag_change_color = false;
		} else if (flag_remove_polygon === true) {
			remove_polygon(find_polygon_by_click(dot));
			flag_remove_polygon = false;
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			apply_fill_poly2all();
		} else {
			dot_positions.push(dot);
			draw_dot(x, y);
	  	}
})

function button_remove_polygon(){
	flag_remove_polygon = true;
	flag_change_color = false;
}

function button_change_color(){
	flag_change_color = true;
	flag_remove_polygon = false;
}

function change_polygon_color(){
	document.getElementById("change_color_screen").style.visibility = "visible";
}

function apply_change_of_color(){
	ctx.fillStyle = "white";
	polygons[save_polygon2_changecolor].color = document.getElementById('new_color').value;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	apply_fill_poly2all();
	document.getElementById("change_color_screen").style.visibility = "hidden";
}

function remove_polygon(polygon_position){
	polygons.splice(polygon_position, 1);
}

function draw_dot(x, y){
	ctx.beginPath();
	ctx.fillStyle = "#000000"; // Cor de fundo
	ctx.arc(x, y, 1, 0, 360, false);
	ctx.fill();
}

function create_y_array(y_min, y_max){
	let y_length = y_max - y_min;
	let array4each_y = []

	aux = y_min;
	for (let i = 0; i < y_length; i++){
		let y_obj = {
			y: aux,
			x: []
		}
		array4each_y.push(y_obj);
		aux++;
	}

	return array4each_y;
}

function save_intersection(dot0, dot1, array2save){ 
	if (dot0.y > dot1.y){ // Without this, the conection between the last and the first dot can't be done
		let aux = dot0;
		dot0 = dot1;
		dot1 = aux;
	}

	let dx = dot1.x - dot0.x;
	let dy = dot1.y - dot0.y;

	let tx = dx / dy;
	let new_x = dot0.x;

	let arr_real_position = array2save[0].y; // first y of the struct created 

	// console.log("Len arra2save: " + array2save.length)
	for (let new_y=dot0.y; new_y < dot1.y; new_y++){ // new_y is the first position of the polygon
		new_x = new_x + tx;
		// console.log("onde vai dar merda: " + (new_y-arr_real_position))
		array2save[new_y-arr_real_position].x.push(new_x);
	}

	// console.log("Len arra2save " + array2save.length + "\nMin " + dot0.y + "\nMax " + dot1.y)

	ctx.beginPath();
	ctx.moveTo(dot0.x, dot0.y);
	ctx.lineTo(dot1.x, dot1.y);
	ctx.stroke();
}

function comparaNumeros(a,b) {
	if (a == b) return 0; 
	if (a < b) return -1; 
	if (a > b) return 1;
}

function sort_x_arrays(y_array){
	for (let i = 0; i < y_array.length; i++){
		y_array[i].x = y_array[i].x.sort(comparaNumeros);
	}
	return y_array;
}

function fill_between_x(x0, x1, y, color){
	for(let i = x0+1; i < x1; i++){
		ctx.beginPath();
		ctx.fillStyle = color; // Cor de fundo
		ctx.arc(i, y, 1, 0, 360, false);
		ctx.fill();

		// ctx.fillRect(i, y, 1, 1);
	}
}

function fill_polygon(y_array, fill_color){
	let first_y_real_pos = y_array[0].y;

	for (let i = 0; i < y_array.length; i++){
		let x_array = y_array[i].x;

		//console.log(first_y_real_pos+i + " << y    " + x_array)
		for (let j = 0; j < x_array.length-1; j+=2){
			fill_between_x(x_array[j], x_array[j+1], first_y_real_pos+i, fill_color);
		}
	}
}

function add_polygon2system(){
	let polygon = {
		dots: dot_positions,
		color: fill_color = document.getElementById('fill_color').value
	}
	polygons.push(polygon);
	apply_fill_poly(polygon);
	dot_positions = []
	y_array = []
}

function apply_fill_poly2all(){
	for (let i=0; i < polygons.length; i++){
		apply_fill_poly(polygons[i]);
	}
}

function found_ymin_ymax(d_positions){ // Return which index from the dots that are the extremes, the higher dot and the lowest dot
	let y_min = 100000;
	let y_max = -1;
	let i_min = -1;
	let i_max = -1;

	for (let i=0; i < d_positions.length; i++){
		if (y_max < d_positions[i].y){
			y_max = d_positions[i].y;
			i_max = i;
		}
		if (y_min > d_positions[i].y){
			y_min = d_positions[i].y;
			i_min = i;
		}
	}
	return [i_min, i_max];
}

function apply_fill_poly(polygon) {
	let y_tuple = found_ymin_ymax(polygon.dots); // Find the extremes y from all the dots
	//console.log(y_tuple[0] + "<< >>" + y_tuple[1])

	// polygon.dots[y_tuple[0]].y += 1;
	// polygon.dots[y_tuple[1]].y -= 1;

	let y_min = polygon.dots[y_tuple[0]].y;
	let y_max = polygon.dots[y_tuple[1]].y;

	y_array = create_y_array(y_min, y_max); // Create the vector guided by the y coordinate

	for (let i = 0; i < polygon.dots.length; i++){ // Save the intersections from dot to dot
		if ( i === polygon.dots.length-1){
			save_intersection(polygon.dots[i], polygon.dots[0], y_array);
		} else {
			save_intersection(polygon.dots[i], polygon.dots[i+1], y_array);
		}
	}

	// polygon.dots[y_tuple[0]].y -= 1;
	// polygon.dots[y_tuple[1]].y += 1;

	y_array = sort_x_arrays(y_array);
	for (let i = 0; i < y_array.length; i++){
		//console.log("y = "+ y_array[i].y + "   x = " + y_array[i].x)
	}
	fill_color = polygon.color;
	fill_polygon(y_array, fill_color);
}

function find_polygon_by_click(click){
	let closer_polygon = -1
	let closer_distance = 10000
	
	for (let i=0; i < polygons.length; i++){
		dist2the_edge = get_nearest_edge(polygons[i], click) // get the distance from all the edges

		if (dist2the_edge < closer_distance){ // search for the closer one and its polygon
			closer_distance = dist2the_edge;
			closer_polygon = i;
		}
	}

	return closer_polygon;
}

function get_nearest_edge(polygon, click){

	let closer_distance = 10000
	for (let i = 0; i < polygon.dots.length; i++){
		if ( i === polygon.dots.length-1){
			aux = calculate_the_distance(polygon.dots[i], polygon.dots[0], click);
		} else {
			aux = calculate_the_distance(polygon.dots[i], polygon.dots[i+1], click);
		}

		if (aux < closer_distance){
			closer_distance = aux;
		}
	}
	return closer_distance
}

function calculate_the_distance(dot0, dot1, click){
	// a = DeltaY/DeltaX 
	// y = ax + b
	// eq. geral a partir da linha acima = -ax + y - b
	// if (dot0.y > dot1.y){ // Without this, the conection between the last and the first dot can't be done
	// 	let aux = dot0;
	// 	dot0 = dot1;
	// 	dot1 = aux;
	// }

	let a = (dot1.y - dot0.y) / (dot1.x - dot0.x)
	let b = - (a * dot0.x - dot0.y)

	a = -a
	b = -b

	return Math.abs(a * click.x + click.y + b) / (Math.sqrt(a^2 + 1^2))
}

function setPixel(imageData, x, y, r, g, b, a) {
	const index = (y * imageData.width + x) * 4;
	imageData.data[index + 0] = r; // Vermelho
	imageData.data[index + 1] = g; // Verde
	imageData.data[index + 2] = b; // Azul
	imageData.data[index + 3] = a; // Alpha
}

