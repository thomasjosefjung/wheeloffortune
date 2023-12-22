let setOfColors = {
    "red": [234, 0, 22],
    "fuchsia": [185, 2, 118],
    "violet": [80, 35, 127],
    "darkblue": [0, 86, 145],
    "lightblue": [0, 142, 207],
    "turquiose": [0, 168, 176],
    "lightgreen": [120, 190, 32],
    "darkgreen": [0, 98, 73]
}

let setOfColorsArray = new Array(8);
let i = 0;
for (const name in setOfColors) {
    setOfColorsArray[i++] = name;
}
let colorIndexCounter = 0;

let currentAttendees = allAttendees;

const StateEnum = { "accelerating": 1, "decelerating": 2, "resting": 3 };
Object.freeze(StateEnum);
let wheelState = StateEnum.resting;

let canvas = document.getElementById("canvas");

// canvas.width  = canvas.offsetWidth;
// canvas.height = canvas.offsetHeight;

let ctx = canvas.getContext('2d');

let currentDirection = 1.0;
let currentSpeed = 0.0;
let targetSpeed = 0.0;
let rotationState = 0;

let delta_t = 10;

let timer = null;

let colors = [];

function updateColorsArray() {
    colors = [];
    let N = allAttendees.length;
    for (i = 0; i < N; ++i) {
        colors.push(randColor());
    }
}

function resetWheel() {
    updateColorsArray();
    currentAttendees = allAttendees;
    wheelState = StateEnum.resting;
    rotationState = 0;
    paintWheel();
}

resetWheel();

function run() {
    if (currentSpeed > 0) {
        return;
    }

    if (wheelState != StateEnum.resting) {
        return;
    }

    wheelState = StateEnum.accelerating;

    if (currentAttendees.length < 1) {
        currentAttendees = allAttendees;
    }

    scale = .003;
    targetSpeed = scale * (3 + (Math.random() * 9));
    timer = setInterval(step, delta_t);
}

function step() {
    switch (wheelState) {
        case (StateEnum.accelerating):
            {
                if (Math.abs(currentSpeed) >= targetSpeed) {
                    wheelState = StateEnum.decelerating;
                } else {
                    currentSpeed += currentDirection * 0.02 * delta_t / 1000;
                }
                break;
            }
        case (StateEnum.decelerating):
            {
                if (Math.abs(currentSpeed) > 0.00005) {
                    currentSpeed /= 1 + delta_t * 2 / 500;
                } else {
                    wheelState = StateEnum.resting;
                }
                break;
            }
        case (StateEnum.resting):
            {
                currentSpeed = 0.0;
                currentDirection *= -1.0;

                clearInterval(timer);
                restart(120);

                let idx = getPersonIndex(rotationState);
                let guy = document.getElementById("guy")
                guy.textContent = currentAttendees[idx];
                guy.style.backgroundColor = colors[allAttendees.indexOf(currentAttendees[idx])];

                currentAttendees = currentAttendees.filter(item => item !== currentAttendees[idx])

                return;
            }
    }

    rotationState += currentSpeed * delta_t;
    paintWheel();

    return;
}



paintWheel();

function paintWheel() {
    let center_x = canvas.width / 2;
    let center_y = canvas.height / 2;

    ctx.translate(center_x, center_y);

    let R = Math.min(canvas.width, canvas.height) / 2.5;

    clear();

    ctx.resetTransform();
    ctx.translate(center_x, center_y);
    ctx.save();
    ctx.rotate(rotationState);

    N = currentAttendees.length;

    for (i = 0; i < N; ++i) {

        let rotation = i / N * Math.PI * 2;

        ctx.save();
        ctx.rotate(rotation);

        // Shadow
        ctx.shadowColor = 'gray';
        ctx.shadowBlur = 10;

        let d = 3000 * Math.abs(currentSpeed);
        let tmp = Math.PI / N;

        let dx = Math.cos(tmp) * d;
        let dy = Math.sin(tmp) * d;
        ctx.translate(dx, dy);


        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(R, 0);
        ctx.arc(0, 0, R, 0, 2 * tmp, false);

        let x = Math.round(Math.cos(2 * tmp) * 10);
        let y = Math.round(Math.sin(2 * tmp) * 10);

        ctx.lineTo(x, y);
        ctx.arc(0, 0, 10, 2 * Math.PI / N, 0, true);
        ctx.closePath();

        ctx.fillStyle = colors[allAttendees.indexOf(currentAttendees[i])];
        ctx.lineWidth = 1;
        ctx.fill();

        ctx.shadowBlur = 0;

        // rotation = 1 / N * Math.PI * 2;
        ctx.rotate(tmp);

        ctx.fillStyle = "black";
        ctx.font = canvas.width / 30 + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"
        ctx.fillStyle = "white";
        ctx.fillText(currentAttendees[i], R / 2 + 5, 0);

        ctx.restore();
    }

    // // paint hole
    // ctx.restore();
    // ctx.beginPath();
    // ctx.arc(0, 0, 10, 0, 2 * Math.PI, false);
    // ctx.fillStyle = "rgba(255,255,255,255)";
    // ctx.closePath();
    // ctx.fill();

    // Paint the triangle 
    ctx.restore();
    ctx.beginPath();

    ctx.moveTo(R - 10, 0);
    ctx.lineTo(R + 20, -15);
    ctx.lineTo(R + 20, 15);
    ctx.closePath();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.stroke();
}

function removeElement(array, index) {
    if (index == 0) {
        return array.slice(1);
    } else if (index == array.length - 1) {
        return array.slice(0, -1);
    } else {
        return array.slice(0, index).concat(array.slice(index + 1));
    }
}

function getPersonIndex(rotationState) {
    rotationState = rotationState / 2 / Math.PI * 360;

    let deltaAngle = 360 / N;
    let angleOffset = rotationState % 360;

    angleTop = 0 - angleOffset - (deltaAngle / 2);

    if (angleTop < 0) {
        angleTop += 360;
    }

    let attIdx = Math.round(angleTop / deltaAngle);
    attIdx = attIdx == currentAttendees.length ? 0 : attIdx;

    return attIdx;
}

function clear() {
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}


// function randColor() {
//     let h = Math.round(Math.random() * 255);
//     // let s = Math.round(Math.random() * 100) + "%";
//     let s = "100%";
//     let l = "64%";

//     return "hsl(" + h + "," + s + "," + l + ")";
// }

function randColor() {
    let c = setOfColors[setOfColorsArray[colorIndexCounter++]];
    if (colorIndexCounter >= 8) {
        colorIndexCounter = 0;
    }

    return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
}

// function resize() {
//     let canvasContainer = document.getElementById("canvas_container");

//     ccWidth = canvasContainer.parentElement.offsetWidth;
//     ccHeight = canvasContainer.parentElement.offsetHeight;

//     p = ccWidth - ccHeight;
//     if (p > 0) {
//         canvasContainer.style.paddingLeft = p / 2 + "px";
//     }

//     let smallerSide = Math.min(ccWidth, ccHeight);

//     canvasContainer.style.width = smallerSide + "px";
//     canvasContainer.style.height = smallerSide + "px";

//     let canvas = document.getElementById("canvas");

//     canvas.style.width = smallerSide - 30 + "px";
//     canvas.style.height = smallerSide - 30 + "px";

//     canvas.width = smallerSide - 30;
//     canvas.height = smallerSide - 30;

//     paintWheel();
// }

function resize() {
    let canvasContainer = document.getElementById("canvas_container");
    let ih = window.innerHeight;
    let iw = window.innerWidth;
    let smallerSide = Math.min(innerWidth, innerHeight);

    let canvas = document.getElementById("canvas");

    let size = smallerSide - 200; 

    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    let canvasWidth = size > 1200 ? size / 2 : smallerSide; 

    canvas.width = size; 
    canvas.height = size; 

    paintWheel(); 
}

resize(); 

// const resizeObserver = new ResizeObserver(entries => {
//     resize();
//     paintWheel(); 
// });
// resize();

// // showNamesEditor();
// resizeObserver.observe(document.body);

