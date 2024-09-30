const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const el = document.querySelector("#myCanvas")

const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
var dot_positions = []; 
var polygons = []

el.addEventListener("click", (e) => {

      const rect = e.target.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log("Esquerda: " + x + " - Topo: " + y);

      var dot = {
        x: x,
        y: y
      }
      dot_positions.push(dot)
      draw_dot(x, y)
    //console.log(dot_positions[0].x + " << x y >> " + dot_positions[0].y)      
})

function draw_dot(x, y){
    ctx.beginPath();
    ctx.fillStyle = "#000000"; // Cor de fundo
    ctx.arc(x, y, 2, 0, 360, false);
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
    if (dot0.y > dot1.y){
        let aux = dot0;
        dot0 = dot1;
        dot1 = aux;
    }

    let dx = dot1.x - dot0.x;
    let dy = dot1.y - dot0.y;

    let tx = dx / dy;
    let new_x = dot0.x;

    let arr_real_postion = array2save[0].y;

    for (let new_y=dot0.y; new_y < dot1.y; new_y++){
        new_x = new_x + tx;

        ctx.beginPath()
        let line_color = document.getElementById('line_color').value
        ctx.fillStyle = line_color; // Cor de fundo
        ctx.arc(new_x, new_y, 1, 0, 360, false);
        ctx.fill();

        // console.log(array2save[new_y-arr_real_postion].y + "<< >>" + new_y)
        array2save[new_y-arr_real_postion].x.push(new_x);
    }
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
        ctx.beginPath()
        ctx.fillStyle = color; // Cor de fundo
        ctx.arc(i, y, 1, 0, 360, false);
        ctx.fill();
    }
}

function fill(y_array, fill_color){
    let first_y_real_pos = y_array[0].y;

    for (let i = 0; i < y_array.length; i++){
        let x_array = y_array[i].x;

        console.log(first_y_real_pos+i + " << y    " + x_array)
        for (let j = 0; j < x_array.length-1; j+=2){
            fill_between_x(x_array[j], x_array[j+1], first_y_real_pos+i, fill_color);
        }
    }
}

function apply_fill_poly2all(){
    let polygon = {
        dots: dot_positions,
        color: fill_color = document.getElementById('fill_color').value
    }
    polygons.push(polygon);

    apply_fill_poly(polygon)
    
    dot_positions = []
    y_array = []
}

function found_ymin_ymax(d_positions){
    let y_min = 100000;
    let y_max = -1;
    for (let i=0; i < d_positions.length; i++){
        if (y_max < d_positions[i].y){
            y_max = d_positions[i].y;
        }
        if (y_min > d_positions[i].y){
            y_min = d_positions[i].y;
        }
    }
    return [y_min, y_max];
}

function apply_fill_poly(polygon) {
    let y_tuple = found_ymin_ymax(polygon.dots);
    //console.log(y_tuple[0] + "<< >>" + y_tuple[1])
    let y_min = y_tuple[0];
    let y_max = y_tuple[1];
    // let y_min = polygon.dots[0].y;
    // let y_max = polygon.dots[polygon.dots.length-1].y;

    y_array = create_y_array(y_min, y_max);

    for (let i = 0; i < polygon.dots.length; i++){
        if ( i === polygon.dots.length-1){
            save_intersection(polygon.dots[i], polygon.dots[0], y_array);
        } else {
            save_intersection(polygon.dots[i], polygon.dots[i+1], y_array);
        }
    }

    y_array = sort_x_arrays(y_array);
    fill_color = polygon.color
    fill(y_array, fill_color);
}

function setPixel(imageData, x, y, r, g, b, a) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index + 0] = r; // Vermelho
    imageData.data[index + 1] = g; // Verde
    imageData.data[index + 2] = b; // Azul
    imageData.data[index + 3] = a; // Alpha
}

