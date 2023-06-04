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
        "content-type": "application/json; charset=utf-8"
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

  const putEvent = async (newEvent) => {
    const res = await fetch(`${API_URL}/${newEvent.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(newEvent)
    });
    return await res.json();
  };

  const patchEvent = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json; charset=utf-8"
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

  async updateEvent(newEvent) {
    const event = await EventAPI.putEvent(newEvent);
    const updateEvent = this.#events.find(item => item.id == event.id);
    updateEvent.eventName = newEvent.eventName;
    updateEvent.startDate = newEvent.startDate;
    updateEvent.endDate = newEvent.endDate;
    console.log("event update:", updateEvent);
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

  removeEditEvent(id) {
    const element = document.getElementById(`event-edit-${id}`);
    element.remove();
  }

  appendEvent(event) {
    const eventElem = this.createEventElem(event);
    const editElem = this.initEventEditElem(event);
    this.eventlist.append(eventElem, editElem);
  }

  refreshNewEvent(event){
    const element = document.getElementById(`event-edit-new`);
    element.remove();
    const eventElem = this.createEventElem(event);
    const editElem = this.initEventEditElem(event);
    this.eventlist.append(eventElem, editElem);
  }

  refreshEditEvent(event){
    const element = document.getElementById(`event-${event.id}`);
    const editEventElem = document.getElementById(`event-edit-${event.id}`);
    console.log(event);
    element.getElementsByClassName("event-name")[0].textContent = event.eventName;
    element.getElementsByClassName("start-date")[0].textContent = event.startDate;
    element.getElementsByClassName("end-date")[0].textContent = event.endDate;
    element.style.display = '';
    editEventElem.style.display = 'None';
  }

  appendEdit() {
    const eventElem = this.createEventEditElem();
    this.eventlist.append(eventElem);
  }

  discardEditEvent(id) {
    const eventElem = document.getElementById(`event-${id}`);
    const editEventElem = document.getElementById(`event-edit-${id}`);
    editEventElem.getElementsByClassName("event-name-input")[0].value = eventElem.getElementsByClassName("event-name")[0].textContent;
    document.getElementById(`start-${id}`).value = eventElem.getElementsByClassName("start-date")[0].textContent;
    document.getElementById(`end-${id}`).value = eventElem.getElementsByClassName("end-date")[0].textContent;
    eventElem.style.display = '';
    editEventElem.style.display = 'None';
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

    const action = document.createElement("td");
    action.classList.add("action")

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("event__delete-btn");
    deleteBtn.setAttribute("remove-id", event.id);
    deleteBtn.textContent = "delete";
    deleteBtn.innerHTML = "<svg viewBox=\"0 0 24 24\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"></path></svg>";


    const editBtn = document.createElement("button");
    editBtn.classList.add("event__edit-btn");
    editBtn.setAttribute("edit-id", event.id);
    editBtn.innerHTML = "<svg viewBox=\"0 0 24 24\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"></path></svg>";

    action.append(editBtn, deleteBtn)
    eventElem.append(eventname, startdate, enddate, action);
    return eventElem;
  }

  initEventEditElem(event) {
    const eventElem = document.createElement("tr");
    eventElem.classList.add("event");
    eventElem.setAttribute("id", `event-edit-${event.id}`);

    const eventname = document.createElement("td");
    const nameInput = document.createElement("input")
    nameInput.classList.add("event-name-input");
    nameInput.value = event.eventName;
    eventname.append(nameInput)

    const startdate = document.createElement("td");
    const startdateinput = document.createElement("input");
    startdateinput.type = "date";
    startdate.classList.add("start-date-input");
    startdateinput.setAttribute("id", `start-${event.id}`);
    startdateinput.value = event.startDate;
    startdate.append(startdateinput);

    const enddate = document.createElement("td");
    const enddateinput = document.createElement("input");
    enddateinput.type = "date"
    enddate.classList.add("end-date-input");
    enddateinput.setAttribute("id", `end-${event.id}`)
    enddateinput.value = event.endDate;
    enddate.append(enddateinput)

    const action = document.createElement("td");
    action.classList.add("action");

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("event__save-btn");
    saveBtn.setAttribute("save-id", `${event.id}`);
    saveBtn.textContent = "save";
    saveBtn.innerHTML = "<svg viewBox=\"0 0 24 24\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z\"></path></svg>";

    const discardBtn = document.createElement("button");
    discardBtn.classList.add("event__discard-btn");
    discardBtn.setAttribute("discard-id", `${event.id}`);
    discardBtn.textContent = "discard";
    discardBtn.innerHTML = "<svg viewBox=\"0 0 32 32\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z\"></path></svg>";

    action.append(saveBtn, discardBtn);
    eventElem.append(eventname, startdate, enddate, action);
    eventElem.style.display='none';
    return eventElem;
  }


  createEventEditElem() {
    const eventElem = document.createElement("tr");
    eventElem.classList.add("event");
    eventElem.setAttribute("id", `event-edit-new`);

    const eventname = document.createElement("td");
    const nameInput = document.createElement("input")
    nameInput.classList.add("event-name-input");
    eventname.append(nameInput)

    const startdate = document.createElement("td");
    const startdateinput = document.createElement("input");
    startdateinput.type = "date"
    startdate.classList.add("start-date-input");
    startdateinput.setAttribute("id", "start-new")
    startdate.append(startdateinput)

    const enddate = document.createElement("td");
    const enddateinput = document.createElement("input");
    enddateinput.type = "date"
    enddate.classList.add("end-date-input");
    enddateinput.setAttribute("id", "end-new")
    enddate.append(enddateinput)


    const action = document.createElement("td");
    action.classList.add("action");

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("event__save-btn");
    saveBtn.setAttribute("save-id", "new");
    saveBtn.innerHTML = "<svg viewBox=\"0 0 24 24\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z\"></path></svg>";

    const discardBtn = document.createElement("button");
    discardBtn.classList.add("event__discard-btn");
    discardBtn.setAttribute("discard-id", "new");
    discardBtn.innerHTML = "<svg viewBox=\"0 0 32 32\" role=\"img\" class=\"svg-icon\" focusable=\"false\"><path d=\"M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z\"></path></svg>";

  
    action.append(saveBtn, discardBtn);

    
    eventElem.append(eventname, startdate, enddate, action);
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
    this.setUpEditEvent();
    this.setUpDiscardEvent();
  }

  setUpAddEvent() {
    this.view.addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!this.editing){
        this.view.appendEdit();
        this.editing = true;
      }
    });
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

  setUpDiscardEvent() {
    this.view.eventlist.addEventListener("click", (e) => {
      const isDeleteBtn = e.target.classList.contains("event__discard-btn");
      if (isDeleteBtn) {
        const removeId = e.target.getAttribute("discard-id");
        if (removeId == "new"){
          this.editing = false;
          this.view.removeEditEvent(removeId);
        } else {
          this.view.discardEditEvent(removeId);
        }
      }
    });
  }

  setUpEditEvent() {
    this.view.eventlist.addEventListener("click", (e) => {
      const isEditBtn = e.target.classList.contains("event__edit-btn");
      if (isEditBtn) {
        const editId = e.target.getAttribute("edit-id");
        const element = document.getElementById(`event-edit-${editId}`);
        const eventEle = document.getElementById(`event-${editId}`);
        element.style.display = '';
        eventEle.style.display = 'none';
      }
    });
  }

  setUpSaveEvent() {
    this.view.eventlist.addEventListener("click", (e) => {
      const isSaveBtn = e.target.classList.contains("event__save-btn");
      if (isSaveBtn) {
        const saveId = e.target.getAttribute("save-id");
        const element = document.getElementById(`event-edit-${saveId}`);
        var name_input = element.getElementsByClassName("event-name-input")[0].value;
        var start_date = document.getElementById(`start-${saveId}`).value.toString();
        var end_date = document.getElementById(`end-${saveId}`).value.toString();
        if (name_input == "" || start_date == "" || end_date == ""){
          alert("Please enter all the input!");
        }else if(start_date > end_date){
          alert("Start date should be less than end date!")
        } else{
          if (saveId == "new"){
            this.editing = false;
            const new_event = {
              "eventName":name_input,
              "startDate":start_date,
              "endDate": end_date}
            this.model.addEvents(new_event)
            .then((back_event)=>{
              this.view.refreshNewEvent(back_event);
              console.log(back_event);}
            );
          } else {
            const new_event = {
              "id" : saveId,
              "eventName":name_input,
              "startDate":start_date,
              "endDate": end_date}
            this.model.updateEvent(new_event)
            .then((back_event)=>{
              this.view.refreshEditEvent(back_event);
              console.log(back_event);}
            );
          }
        }
      }
    });
  }
}

const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
