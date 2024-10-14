let dot0 = {
    y:1,
    x:2
}

let dot1 = {
    y:7,
    x:5
}


let a = (dot1.y - dot0.y) / (dot1.x - dot0.x)
let b = - (a * dot0.x - dot0.y)

// a = -a
// b = -b
// eq geral: ax + 1 - b

console.log("eq reduzida: y = " + a + "x" + " + " + b)
console.log("eq geral: " + -a + "x" + " + 1 - " + b)

console.log(a)
console.log(b)

// eq. reduzida y = ax + b
// eq. geral a partir da reduzida = -ax + y - b

a = 3
b = 1

console.log(Math.abs(((a * 2) + (-4 * 3) + b) / Math.sqrt(Math.abs(a)**2 + 4**2)))