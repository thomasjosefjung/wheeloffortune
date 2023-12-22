let allAttendees = JSON.parse(window.localStorage.getItem("allNames"));
if (allAttendees == null) {
    allAttendees = ["Hans Meiser", "Kurt Felix", "Stefan Raab", "Jürgen Dietrich", "Johannes Ulrich"];
}

function showNamesEditor() {
    let nameslist = document.getElementById("nameslist");

    N = currentAttendees.length;

    let linesData = [];

    allAttendees.forEach(name => {
        let line = [];
        line.push("<span>" + name + "</span>");
        line.push("<a href=\"#\" onClick=\"removeName('" + name + "');\"><img style=\"height:20px\" src = \"./static/delete.svg\" />")

        linesData.push(line);
    })

    let innerHTML = "<div style=\"\"><table style = \"margin:auto;\">";

    linesData.forEach(line => {
        innerHTML += "<tr><td style=\"text-align: right;\">";
        innerHTML += line[0];
        innerHTML += "</td><td>";
        innerHTML += line[1];
        innerHTML += "</td></tr>";
    })

    innerHTML.innerHTML += "</table></div>";

    nameslist.innerHTML = innerHTML;

    document.getElementById("nameseditor").style.visibility = "visible";
}

function removeName(name) {
    allAttendees = allAttendees.filter(item => item !== name);
    queueMicrotask(() => showNamesEditor());
}

function addName() {
    let input = document.getElementById("inputnewname");
    allAttendees.push(input.value);
    input.value = "";
    queueMicrotask(() => showNamesEditor());
}

function nameseditorclose() {
    document.getElementById("nameseditor").style.visibility = "hidden";
    window.localStorage.setItem("allNames", JSON.stringify(allAttendees));
    resetWheel();
}

let remaining = allAttendees.slice();

function counter(duration) {
    let counter = 0;
    return function() {
        counter++;
        document.getElementById("counter").innerHTML = duration - counter;
        document.getElementById("alarm").hidden = (duration - counter) > 0;
    }
}

let interval_handler = undefined;

function next() {
    restart(120);
    document.getElementById("countertext").hidden = false;

    const output = (remaining.length > 0) ? remaining.splice(Math.floor(Math.random() * remaining.length), 1) : " Kaffee! ";

    document.getElementById("guy").innerHTML = output;
    //    updateJoke();
}

function getSmalltalkDuration() {
    return Math.floor(240 * Math.random());
}

function restart(duration) {
    clearInterval(interval_handler);
    interval_handler = setInterval(counter(duration), 1000);
}

function reset() {
    remaining = attendees.slice();
    // document.getElementById("countertext").hidden = true;
    document.getElementById("alarm").hidden = true;
    document.getElementById("alarm").textContent = " Time is up! "
    document.getElementById("guy").innerHTML = "Smalltalk";
    restart(getSmalltalkDuration());
}

