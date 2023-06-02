const create = document.querySelector("#create");
const read = document.querySelector("#read");
const exit = document.querySelector("#create #exit");
const exit2 = document.querySelector("#read #exit");
const newNotes = document.querySelector("#newNotes");
let allNotes = localStorage.getItem("notes") ? [...JSON.parse(localStorage.getItem("notes"))] : [];
// SHowing and Hiding Create Panel
const displayCreate = (element) => {
  element.classList.toggle("d-none");
}
newNotes.onclick = () => {
  const date = new Date()
  document.querySelector("#time").innerHTML = `${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`
  displayCreate(create);

};
// Closing Add Notes
exit.onclick = () => displayCreate(create);
exit2.onclick = () => displayCreate(read);
// Selecting Circle Color
const circles = document.querySelectorAll(".circle");

const selectCircleColor = () => {
  circles.forEach(circle => {
    circle.onclick = () => {
      const prevCircle = document.querySelector(".circle.selected");
      if (prevCircle) {
        prevCircle.classList.remove("selected")
      }
      circle.classList.add("selected");


    }

  });
}
// Notes Data
const notesData = (data_title, data_subtitle, id) => {
  const title = document.querySelector(data_title);
  const subtitle = document.querySelector(data_subtitle);
  const date = new Date();
  const today = date.toLocaleDateString();
  const time = `${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[date.getDay()];
  const selectedColor = document.querySelector(".circle.selected");
  const color = selectedColor ? selectedColor.getAttribute("id") : "#dff1ff";
  let note = {
    id,
    title: title.value,
    subtitle: subtitle.value,
    time,
    day,
    date: today,
    color
  }
  // Removing data from inputs
  title.value = "";
  subtitle.value = "";
  if (selectedColor) {
    selectedColor.classList.remove("selected");

  }
  return note;
};

// Creating New Elements
const createNewElement = (title, subtitle, time, day, date, color, id) => {
  const div = document.createElement("div");
  div.setAttribute("class", "col-3 notes NOTES");
  div.setAttribute("style", `background-color:${color}`);
  div.setAttribute("id", `${id}`)
  div.innerHTML = `
    <div class="p-3">
    <p class="m-0 mb-2">${date}</p>
    <div
      class="d-flex justify-content-between align-items-center border-bottom border-dark pb-3"
    >
      <h1 class="fs-5 m-0">${title}</h1>
      <span class="bg-dark p-2 delete d-flex justify-content-center align-items-center">
        <i class="delete entypo-icon-trash text-white"></i>
      </span>
    </div>

    <div class="my-4">
      <p>
        ${subtitle.slice(0, 150)}
      </p>
    </div>

    <div class="d-flex align-items-center gap-2">
      <i data-feather="clock" width="14px"></i>
      <p class="m-0">${time}, ${day}</p>
    </div>
  </div>
    `
  const notesCon = document.querySelector("#notes-con")
  const createNote = document.querySelector("#createNote")
  notesCon.insertBefore(div, createNote);
  feather.replace();
}
// Add Note
const addNote = () => {
  // Creating New Element
  if (title.value != "" && subtitle.value != "") {
    let note = notesData("#create #title", "#create #subtitle", Math.floor(Math.random() * 10000))
    createNewElement(note.title, note.subtitle, note.time, note.day, note.date, note.color, note.id);
    // Hiding Create Container
    displayCreate(create);
    // Run Read Again Function
    runReadNoteAgain();
    //Adding new Item to allNotes
    allNotes.push(note);
    // Adding to local Storage
    if (!localStorage.getItem("notes")) {
      localStorage.setItem("notes", JSON.stringify([note]));
    } else {
      let notes = JSON.parse(localStorage.getItem("notes"));
      notes.push(note);
      localStorage.setItem("notes", JSON.stringify(notes));
    }

  } else {
    if (title.value == "") {
      title.style.border = "1px solid red";
    }
    if (subtitle.value == "") {
      subtitle.style.border = "1px solid red";
    }
  }


}


// Changing Input
document.querySelector("#title").onkeydown = () => {
  document.querySelector("#title").style.border = "1px solid rgba(0, 0, 0, 0.1)";
}

document.querySelector("#subtitle").onkeydown = () => {
  document.querySelector("#subtitle").style.border = "1px solid rgba(0, 0, 0, 0.1)";
}
// Saving NOtes
document.querySelector("#create").onkeydown = (e) => {
  if (e.key == "Enter") {
    addNote()
  }
}
const save = document.querySelector("#save");
save.onclick = addNote;

// Reading Notes
let editID = "";
const readNote = (id) => {
  // Displaying Create
  displayCreate(read);
  const note = allNotes.filter(item => item.id == id)[0];
  document.querySelector("#read_title").innerHTML = note.title;
  document.querySelector("#read_subtitle").innerHTML = note.subtitle;
  editID = note;
}
const runReadNoteAgain = () => {
  const notes = document.querySelectorAll(".NOTES");
  notes.forEach(note => {
    note.onclick = (e) => {
      if (e.target.classList.contains("delete")) {
        deleteNote(note.id)
      } else {
        readNote(note.id);
      }

    };
  });
};


// Editing Notes
const editIcon = document.querySelector("#edit-icon");
const edit = document.querySelector("#edit");

editIcon.onclick = () => {

  displayCreate(read);//Hiding Read Container
  displayCreate(edit);//Showing Edit Container
  // Selecting Color
  circles.forEach(circle => {
    if (circle.getAttribute("id") == editID.color) {
      circle.classList.add("selected")
    } else {
      circle.classList.remove("selected")

    }
  })
  selectCircleColor();


  // Adding title and subtitle
  const input = document.querySelector("#edit input");
  const textarea = document.querySelector("#edit textarea");
  input.value = editID.title;
  textarea.value = editID.subtitle;
  // Adding Time
  const time = document.querySelector("#edit #time");
  time.innerHTML = `${editID.day} ${editID.time}, (Last Edited)`;
}

// Saving Editted Notes
const saveEditted = document.querySelector("#edit #save");
saveEditted.onclick = () => {
  let note = notesData("#edit input", "#edit textarea", editID.id);
  let newArr = allNotes.map(item => {
    if (item.id == editID.id) {
      return note;
    } else {
      return item
    }
  });
  // Updating New Arr
  allNotes = newArr;

  // Generating New Notes
  displayNotes();
  localStorage.setItem("notes", JSON.stringify(newArr));
  // Hiding Edit
  displayCreate(edit);

}
// Closing Edit Notes
const exit3 = document.querySelector("#edit #exit");
exit3.onclick = () => {
  displayCreate(edit);
}
// Displaying items from localstorage
function displayNotes() {
  // Removing Existing Note
  document.querySelectorAll(".NOTES").forEach(note => {
    note.remove();
  });
  allNotes.map(item => {
    createNewElement(item.title, item.subtitle, item.time, item.day, item.date, item.color, item.id);
  })
  runReadNoteAgain();
  selectCircleColor();
}

displayNotes();
const deleteNote = (id) => {
  const newNotes = allNotes.filter(item => item.id != id);
  // Updating Array
  allNotes = newNotes;
  // Storing In Localstorage
  localStorage.setItem("notes", JSON.stringify(allNotes))
  displayNotes();
}
// Deleting All Notes
document.querySelector("#deleteAll").onclick = () => {
  allNotes = [];
  // Storing In Localstorage
  localStorage.setItem("notes", JSON.stringify(allNotes))
  displayNotes();
}