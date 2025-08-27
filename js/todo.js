let events = JSON.parse(localStorage.getItem("404EVENTS")); // Grab the config from local storage.
if (events == null) {
    events = [];
}

function addEvent() {
    const title = document.getElementById("eventName");
    const date = document.getElementById("eventDate");
    const time = document.getElementById("eventTime");
    const body = document.getElementById("eventBody");
    const datetime = Date.parse(date.value + " " + time.value);

    if (!date.value || !time.value || !title.value) {
        alert("Please provide a title, date, and time.");
    } else {
        events.push({
            "title": title.value,
            "datetime": datetime,
            "body": body.value
        });
        localStorage.setItem("404EVENTS", JSON.stringify(events));
        renderEvents();
        hideModal();

        title.value = "";
        date.value = "";
        time.value = "";
        body.value = "";
    }
}


function renderEvents() {
    const container = document.getElementById("todo-body");
    container.innerHTML = "";
    events.sort((a,b) => a.datetime - b.datetime);
    let i = 0;
    events.forEach(event => {
        console.log(event);
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.setAttribute("index", i);

        const left = document.createElement("div");
        left.classList.add("event-left");
        const right = document.createElement("div");
        right.classList.add("event-right");
        
        const head = document.createElement("span");
        head.textContent = event.title;
        head.classList.add("eventHead");

        const date = document.createElement("span");
        const d = new Date(event.datetime);
        date.textContent = `${d.toLocaleString()}`;
        date.classList.add("eventDate");

        const body = document.createElement("span");
        body.textContent = event.body;
        body.classList.add("eventBody");

        const del = document.createElement("span");
        del.innerHTML = "<i class='fas fa-trash-alt' />"
        del.classList.add("eventDelete");
        del.setAttribute("title", "Remove this entry.");
        del.onclick = function() {
            deleteEvent(parseInt(eventDiv.getAttribute("index")));
        }

        left.appendChild(head);
        left.appendChild(date);
        if (event.body)
            left.appendChild(body);
        right.appendChild(del);
        
        eventDiv.appendChild(left);
        eventDiv.appendChild(right);

        container.appendChild(eventDiv);
        i++;
    });
}

function deleteEvent(i) {
    console.log(typeof i)
    events.splice(i, 1);
    renderEvents();
    localStorage.setItem("404EVENTS", JSON.stringify(events));
}

renderEvents();
