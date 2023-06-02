const EventAPI = (function API() {
  const API_URL = "http://localhost:3000/events";

  const getEvents = async () => {
    const res = await fetch(`${API_URL}`);
    return await res.json();
  };

  const postEvent = async (newEvent) => {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf8"
      },
      body: JSON.stringify(newEvent)
    });
    return await res.json();
  };

  const deleteEvent = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  };

  const putEvent = async (id, newdate) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json; charset=utf8"
      },
      body: JSON.stringify(newdate)
    });
    return await res.json();
  };

  const patchEvent = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json; charset=utf8"
      }
    });
    return await res.json();
  };

  return {
    getEvents,
    postEvent,
    deleteEvent,
    putEvent,
    patchEvent
  };
})();

const newEvent = {
  eventName: "Test Festival2",
  startDate: "2023-01-31",
  endDate: "2023-03-21"
};


class EventModel {
  #events = [];
  constructor() {}
  getEvents() {
    return this.#events;
  }
  async fetchEvents() {
    this.#events = await EventAPI.getEvents();
  }
  async addEvents(newEvent) {
    const event = await EventAPI.postEvent(newEvent);
    this.#events.push(event);
    return event;
  }

  async removeEvent(id) {
    const removedId = await EventAPI.deleteEvent(id);
    this.#events = this.#events.filter((event) => event.id !== id);
    return removedId;
  }
}

class EventView {
  constructor() {
    // this.form = document.querySelector(".event-app__form");
    this.addBtn = document.querySelector(".event-app__add-btn");
    this.eventlist = document.querySelector(".eventlist");
  }

  initRenderEvents(events) {
    console.log(events);
    this.eventlist.innerHTML = "<tr><th>Event</th><th>Start</th><th>End</th><th>Actions</th></tr>";
    events.forEach((event) => {
      this.appendEvent(event);
    });
  }

  removeEvent(id) {
    const element = document.getElementById(`event-${id}`);
    element.remove();
  }

  appendEvent(event) {
    const eventElem = this.createEventElem(event);
    this.eventlist.append(eventElem);
  }

  appendEdit() {
    const eventElem = this.createEventEditElem();
    this.eventlist.append(eventElem);
  }

  createEventElem(event) {
    const eventElem = document.createElement("tr");
    eventElem.classList.add("event");
    eventElem.setAttribute("id", `event-${event.id}`);

    const eventname = document.createElement("td");
    eventname.classList.add("event-name");
    eventname.textContent = event.eventName;

    const startdate = document.createElement("td");
    startdate.classList.add("start-date");
    startdate.textContent = event.startDate;

    const enddate = document.createElement("td");
    enddate.classList.add("end-date");
    enddate.textContent = event.endDate;


    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("event__delete-btn");
    deleteBtn.setAttribute("remove-id", event.id);
    deleteBtn.textContent = "delete";

    const editBtn = document.createElement("button");
    editBtn.classList.add("event__edit-btn");
    editBtn.setAttribute("edit-id", event.id);
    editBtn.textContent = "edit";

    eventElem.append(eventname, startdate, enddate, editBtn, deleteBtn);
    return eventElem;
  }

  createEventEditElem() {
    const eventElem = document.createElement("tr");
    eventElem.classList.add("event");
    eventElem.setAttribute("id", `event-new`);

    const eventname = document.createElement("td");
    const nameInput = document.createElement("input")
    nameInput.classList.add("event-name-input");
    eventname.append(nameInput)

    const startdate = document.createElement("td");
    const startdateinput = document.createElement("input");
    startdateinput.type = "date"
    startdate.classList.add("start-date-input");
    startdateinput.setAttribute("id", "new-start")
    startdate.append(startdateinput)

    const enddate = document.createElement("td");
    const enddateinput = document.createElement("input");
    enddateinput.type = "date"
    enddate.classList.add("end-date-input");
    enddateinput.setAttribute("id", "new-end")
    enddate.append(enddateinput)

    const editBtn = document.createElement("button");
    editBtn.classList.add("event__save-btn");
    editBtn.setAttribute("save-id", "new");
    editBtn.textContent = "save";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("event__delete-btn");
    deleteBtn.setAttribute("remove-id", "new");
    deleteBtn.textContent = "discard";


    eventElem.append(eventname, startdate, enddate, editBtn, deleteBtn);
    return eventElem;
  }
}

class EventController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.editing = false;
    this.init();
  }

  async init() {
    this.setUpEvents();
    await this.model.fetchEvents();
    this.view.initRenderEvents(this.model.getEvents());
  }

  setUpEvents() {
    this.setUpAddEvent();
    this.setUpDeleteEvent();
    this.setUpSaveEvent();
  }

  setUpAddEvent() {
    this.view.addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!this.editing){
        this.view.appendEdit();
        this.editing = true;
      }
    });
    
    // this.view.form.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   const title = this.view.input.value;
    //   this.model
    //     .addEvent({
    //       title,
    //       completed: false,
    //     })
    //     .then((event) => {
    //       this.view.appendEvent(event);
    //     });
    // });
  }

  setUpDeleteEvent() {
    this.view.eventlist.addEventListener("click", (e) => {
      const isDeleteBtn = e.target.classList.contains("event__delete-btn");
      if (isDeleteBtn) {
        const removeId = e.target.getAttribute("remove-id");
        this.model.removeEvent(removeId).then(() => {
          this.view.removeEvent(removeId);
        });
      }
    });
  }

  setUpSaveEvent() {
    this.view.eventlist.addEventListener("click", (e) => {
      const isSaveBtn = e.target.classList.contains("event__save-btn");
      if (isSaveBtn) {
        const saveId = e.target.getAttribute("save-id");
        const element = document.getElementById(`event-${saveId}`);
        var name_input = element.getElementsByClassName("event-name-input")[0].value;
        var start_date = document.getElementById("new-start").value;
        var end_date = element.getElementsByClassName("end-date-input")[0].value;
        console.log(name_input, start_date, end_date);

      }
    });
  }

}

const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
