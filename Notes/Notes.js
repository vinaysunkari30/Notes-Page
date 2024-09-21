let homePage = document.getElementById("homePage");
let notesPage = document.getElementById("notesPage");
let mainNoteContainer = document.getElementById("noteContainer");
let noteSaveBtn = document.getElementById("saveBtn");
let notesBannerSection = document.getElementById("notesBannerContainer");
let emptyImg = document.getElementById("emptyNoteImg");
let noteTitle = document.getElementById("noteTitle");
let noteNote = document.getElementById("noteNote");
let titleInput = document.getElementById("titleInput");
let noteInput = document.getElementById("noteInput");
let noteDeleteBtn = document.getElementById("noteDelete");
let noteEditBtn = document.getElementById("editIcon");
let editNoteSave = document.getElementById("editNoteSave");
let trashPage = document.getElementById("trashPage");
let deletedNotesCon = document.getElementById("deletedNotesContainer");


function getDateAndTime(){
    let presentDate = new Date();
    const months  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let noteDate = presentDate.getDate() + ",";
    let noteMonth = months[presentDate.getMonth()];
    let noteYear = presentDate.getFullYear();
    let hours = presentDate.getHours();
    let minutes = presentDate.getMinutes();
    let amOrPm = hours >= 12 ? "pm" : "am";
    let minute = minutes < 10 ? "0" + minutes : minutes;
    let hour = hours % 12;
    let noteTime = hour + ":" + minute + " " + amOrPm;
    const dateObject= {date: noteDate, month: noteMonth, year: noteYear, time: noteTime};
    return dateObject;
}

function getValuesFromStorage() {
    let stringifiedList = localStorage.getItem("notesList");
    let parsedList = JSON.parse(stringifiedList);
    if (parsedList === null) {
        return [];
    } else {
        return parsedList;
    }
}

let notesList = getValuesFromStorage();

function toGetNoteId(noteId) {
    let objectId = notesList.findIndex(function(eachNote) {
        let eachNoteId = "note" + eachNote.uniqueNo;
        if (eachNoteId === noteId) {
            return true;
        } else {
            return false;
        }
    });
    return objectId;
}

let noteCloseBtn = document.getElementById("noteCloseBtn");
noteCloseBtn.onclick = function() {
    mainNoteContainer.classList.toggle("d-none");
    notesPage.classList.toggle("d-none");
    if(titleInput.value === "" && noteInput.value === ""){
        titleInput.classList.add("d-none");
        noteInput.classList.add("d-none");

        noteTitle.classList.remove("d-none");
        noteNote.classList.remove("d-none");

        noteDeleteBtn.classList.remove("d-none");
        noteEditBtn.classList.remove("d-none");
        editNoteSave.classList.add("d-none");
    }
};

function addNotesListToStorage(notesList) {
    localStorage.setItem("notesList", JSON.stringify(notesList));
}

function toSetValues(noteObject, noteIds) {
    let {
        title,
        note
    } = noteObject;

    titleInput.classList.add("d-none");
    noteInput.classList.add("d-none");

    noteTitle.classList.remove("d-none");
    noteNote.classList.remove("d-none");

    noteTitle.innerHTML = title;
    noteNote.innerHTML = note;

    let updatedTitle = document.getElementById(noteIds.titleId);
    let updatedNote = document.getElementById(noteIds.noteId);

    updatedTitle.innerHTML = title;
    updatedNote.innerHTML = note;

    noteDeleteBtn.classList.remove("d-none");
    noteEditBtn.classList.remove("d-none");
    editNoteSave.classList.add("d-none");
}

function toEditNote(noteIds) {
    let newNoteindex = toGetNoteId(noteIds.notesId);
    let newNoteObject = notesList[newNoteindex];
    let newNoteId = "note" + newNoteObject.uniqueNo;

    noteTitle.classList.add("d-none");
    noteNote.classList.add("d-none");

    titleInput.classList.remove("d-none");
    noteInput.classList.remove("d-none");

    notesList.forEach((note) => {
        let dateAndTime = getDateAndTime();
        const {date, month, year, time} = dateAndTime
        if (noteIds.notesId === newNoteId) {
            editNoteSave.classList.remove("d-none");
            editNoteSave.onclick = function() {
                note.title = titleInput.value;
                note.note = noteInput.value;
                note.dateObj.date = date;
                note.dateObj.month = month;
                note.dateObj.year = year;
                note.dateObj.time = time;
                addNotesListToStorage(notesList);
                toSetValues(note, noteIds);
                mainNoteContainer.classList.toggle("d-none");
                notesPage.classList.toggle("d-none");
            };
        }
    });
}


function onOpenNote(noteIds, noteObject, dateEle) {
    let {
        note,
        title,
        dateObj,
    } = noteObject;

    notesPage.classList.toggle("d-none");
    mainNoteContainer.classList.toggle("d-none");

    noteTitle.innerHTML = title;
    noteNote.innerHTML = note;
    noteDeleteBtn.onclick = function() {
        let dateNoteCon = document.getElementById(dateNoteId);
        mainNoteContainer.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
        notesBannerSection.removeChild(dateNoteCon);
    };
    
    noteEditBtn.onclick = function() {
        toEditNote(noteObject, noteIds, dateEle);
        noteEditBtn.classList.add("d-none");
        noteDeleteBtn.classList.add("d-none");
    };

}

function toGetNote(noteIds, dateEle) {
    let noteObjectIndex = toGetNoteId(noteIds.notesId);
    let noteObject = notesList[noteObjectIndex];

    onOpenNote(noteIds, noteObject, dateEle);
}


function getDeletedNotesListFromStorage() {
    let deletedNotes = localStorage.getItem("deletedNotesList");
    let deletedNotesList = JSON.parse(deletedNotes);
    if (deletedNotesList === null) {
        return [];
    } else {
        return deletedNotesList;
    }
}

let deletedNotesList = getDeletedNotesListFromStorage();

function addDeletedNotesListToStorage(notesList) {
    let stringifiedDeletedNotesList = JSON.stringify(notesList);
    localStorage.setItem("deletedNotesList", stringifiedDeletedNotesList);
    getDeletedNotesListFromStorage();
}

function deleteNotesFromStorage(noteId){
    let objectId = toGetNoteId(noteId);

    deletedNotesList.splice(objectId, 1);
    addDeletedNotesListToStorage(deletedNotesList);
    if (deletedNotesList.length === 0) {
        emptyTrashImg.classList.remove("d-none");
    }
}

function createAndAppendDeletedNotes(noteObject) {

    let noteId = "note" + noteObject.uniqueNo;
    let dateNoteId = "dateNote" + noteObject.uniqueNo;
    let noteTitleId = "noteTitle" + noteObject.uniqueNo;
    let noteNoteId = "noteNote" + noteObject.uniqueNo;

    let dateElements = ["noteDate", "noteDay", "noteYear", "noteTime"];
    let {
        note,
        title,
        dateObj,
        uniqueNo
    } = noteObject;

    const noteIds = {
        notesId: noteId,
        dateNoteId: dateNoteId,
        titleId: noteTitleId,
        noteId: noteNoteId
    };

    let dateNoteContainer = document.createElement("div");
    dateNoteContainer.id = noteIds.dateNoteId;
    dateNoteContainer.classList.add("col-12", "col-md-12", "col-lg-9", "d-flex", "flex-row");
    deletedNotesCon.appendChild(dateNoteContainer);

    let dateContainer = document.createElement("div");
    dateContainer.classList.add("d-flex", "flex-row", "justify-content-center", "col-3", "date-container");
    dateNoteContainer.appendChild(dateContainer);

    let iconEle = document.createElement("i");
    iconEle.classList.add("fa-regular", "fa-calendar", "calendar-icon");
    dateContainer.appendChild(iconEle);

    let noteDateEle = document.createElement("h5");
    noteDateEle.id = dateElements[0];
    noteDateEle.innerHTML = dateObj.date;
    noteDateEle.classList.add("note-date");
    dateContainer.appendChild(noteDateEle);

    let noteDayEle = document.createElement("h5");
    noteDayEle.id = dateElements[1];
    noteDayEle.innerHTML = dateObj.month;
    noteDayEle.classList.add("note-day");
    dateContainer.appendChild(noteDayEle);

    let noteYearEle = document.createElement("h5");
    noteYearEle.id = dateElements[2];
    noteYearEle.innerHTML = dateObj.year;
    noteYearEle.classList.add("note-year");
    dateContainer.appendChild(noteYearEle);

    let timeEle = document.createElement("h6");
    timeEle.id = dateElements[3];
    timeEle.classList.add("time", "d-none", "d-md-block");
    timeEle.innerHTML = dateObj.time;
    dateContainer.appendChild(timeEle);

    let verticalLine = document.createElement("div");
    verticalLine.classList.add("vertical-line");
    dateNoteContainer.appendChild(verticalLine);

    let noteContainer = document.createElement("div");
    noteContainer.id = noteIds.notesId;
    noteContainer.classList.add("note-btn");
    dateNoteContainer.appendChild(noteContainer);

    let titleEle = document.createElement("h1");
    titleEle.id = noteIds.titleId;
    titleEle.innerHTML = title;
    titleEle.classList.add("notes-title");
    noteContainer.appendChild(titleEle);

    let noteEle = document.createElement("p");
    noteEle.id = noteIds.noteId;
    noteEle.innerHTML = note;
    noteEle.classList.add("notes-note");
    noteContainer.appendChild(noteEle);

    let noteTimeEle = document.createElement("h6");
    noteTimeEle.classList.add("time", "d-md-none");
    noteTimeEle.innerHTML = dateObj.time;
    noteContainer.appendChild(noteTimeEle);

    let deleteBtn = document.createElement("button");
    deleteBtn.id = "deletedNoteBtn"
    deleteBtn.classList.add("delete-btn");
    dateNoteContainer.appendChild(deleteBtn);

    deleteBtn.onclick = function(){
        deletedNotesCon.removeChild(dateNoteContainer);
        deleteNotesFromStorage(noteId);
    }

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("trash-icon", "fa-solid", "fa-trash");
    deleteBtn.appendChild(deleteIcon);
}

for (let note of deletedNotesList) {
    createAndAppendDeletedNotes(note);
}

function deleteFromLocalStorage(noteId) {
    let objectId = toGetNoteId(noteId);

    deletedNotesList.push(notesList[objectId]);
    createAndAppendDeletedNotes(notesList[objectId]);
    addDeletedNotesListToStorage(deletedNotesList);

    notesList.splice(objectId, 1);
    addNotesListToStorage(notesList);
    if (notesList.length === 0) {
        emptyImg.classList.remove("d-none");
    }
}

function createAndAppendNote(noteObject) {
    let noteId = "note" + noteObject.uniqueNo;
    let dateNoteId = "dateNote" + noteObject.uniqueNo;
    let noteTitleId = "noteTitle" + noteObject.uniqueNo;
    let noteNoteId = "noteNote" + noteObject.uniqueNo;

    let dateElements = ["noteDate", "noteDay", "noteYear", "noteTime"];
    let {
        note,
        title,
        dateObj,
        uniqueNo
    } = noteObject;

    const noteIds = {
        notesId: noteId,
        dateNoteId: dateNoteId,
        titleId: noteTitleId,
        noteId: noteNoteId
    };

    let dateNoteContainer = document.createElement("div");
    dateNoteContainer.id = noteIds.dateNoteId;
    dateNoteContainer.classList.add("col-12", "col-md-12", "col-lg-9", "d-flex", "flex-row", "date-note-banner");
    notesBannerSection.appendChild(dateNoteContainer);

    let dateContainer = document.createElement("div");
    dateContainer.classList.add("d-flex", "flex-row", "justify-content-center", "col-3", "date-container");
    dateNoteContainer.appendChild(dateContainer);

    let iconEle = document.createElement("i");
    iconEle.classList.add("fa-regular", "fa-calendar", "calendar-icon");
    dateContainer.appendChild(iconEle);

    let noteDateEle = document.createElement("h5");
    noteDateEle.id = dateElements[0];
    noteDateEle.innerHTML = dateObj.date;
    noteDateEle.classList.add("note-date");
    dateContainer.appendChild(noteDateEle);

    let noteDayEle = document.createElement("h5");
    noteDayEle.id = dateElements[1];
    noteDayEle.innerHTML = dateObj.month;
    noteDayEle.classList.add("note-day");
    dateContainer.appendChild(noteDayEle);

    let noteYearEle = document.createElement("h5");
    noteYearEle.id = dateElements[2];
    noteYearEle.innerHTML = dateObj.year;
    noteYearEle.classList.add("note-year");
    dateContainer.appendChild(noteYearEle);

    let timeEle = document.createElement("h6");
    timeEle.id = dateElements[3];
    timeEle.classList.add("time", "d-none", "d-md-block");
    timeEle.innerHTML = dateObj.time;
    dateContainer.appendChild(timeEle);

    let verticalLine = document.createElement("div");
    verticalLine.classList.add("vertical-line");
    dateNoteContainer.appendChild(verticalLine);

    let noteContainer = document.createElement("div");
    noteContainer.id = noteIds.notesId;
    noteContainer.classList.add("note-btn");
    dateNoteContainer.appendChild(noteContainer);

    let titleEle = document.createElement("h1");
    titleEle.id = noteIds.titleId;
    titleEle.innerHTML = title;
    titleEle.classList.add("notes-title");
    noteContainer.appendChild(titleEle);

    let noteEle = document.createElement("p");
    noteEle.id = noteIds.noteId;
    noteEle.innerHTML = note;
    noteEle.classList.add("notes-note");
    noteContainer.appendChild(noteEle);

    let noteTimeEle = document.createElement("h6");
    noteTimeEle.classList.add("time", "d-md-none");
    noteTimeEle.innerHTML = dateObj.time;
    noteContainer.appendChild(noteTimeEle);

    noteContainer.onclick = function() {
        toGetNote(noteIds, dateElements);
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    dateNoteContainer.appendChild(deleteBtn);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("trash-icon", "fa-solid", "fa-trash");
    deleteBtn.appendChild(deleteIcon);

    deleteBtn.onclick = function() {
        notesBannerSection.removeChild(dateNoteContainer);
        deleteFromLocalStorage(noteIds.notesId);
    };
}

for (let note of notesList) {
    createAndAppendNote(note);
}

function addValuesToLocalStorage() {
    let dateAndTime = getDateAndTime();
    const {date, month, year, time} = dateAndTime
    let titleEle = document.getElementById("title");
    let noteEle = document.getElementById("note");

    let titleValue = titleEle.value;
    let noteValue = noteEle.value;

    if (titleValue === "") {
        alert("Enter Valid Title");
    } else if (noteValue === "") {
        alert("Enter valid Note");
    }
    let noteCount = notesList.length;
    let newNote = {
        title: titleValue,
        note: noteValue,
        dateObj: {
            date: date,
            month: month,
            year: year,
            time: time
        },
        uniqueNo: noteCount + 1
    };
    notesList.push(newNote);
    if (titleValue !== "" && noteValue !== "") {
        addNotesListToStorage(notesList);
        getValuesFromStorage();
        homePage.classList.add("d-none");
        notesPage.classList.remove("d-none");
        createAndAppendNote(newNote);
        titleEle.value = "";
        noteEle.value = "";
        emptyImg.classList.add("d-none");
    }
}

let saveBtn = document.getElementById("saveBtn");
saveBtn.onclick = function() {
    addValuesToLocalStorage();
}

let emptyTrashImg = document.getElementById("emptyTrashImg");


//Home Page Btns
let footerNoteBtn = document.getElementById("footerNoteBtn");
let homeFooterTrashBtn = document.getElementById("footerDeleteBtn");

let sideNoteBtn = document.getElementById("noteBtn");
let sideTrashBtn = document.getElementById("deleteBtn");

//Notes Page Btns

let notesFooterHomeBtn = document.getElementById("notesFooterHomeBtn");
let notesTrashFooterBtn = document.getElementById("noteFooterDeleteBtn");

let sideNoteHomeBtn = document.getElementById("noteHomeBtn");
let sideNoteTrashBtn = document.getElementById("noteDeleteBtn");

//Trash Page Btns
let trashFooterHomeBtn = document.getElementById("trashFooterHomeBtn");
let trashNotesFooterBtn = document.getElementById("trashFooterNoteBtn");

let sideTrashHomeBtn = document.getElementById("trashHomeBtn");
let sideTrashNoteBtn = document.getElementById("trashNoteBtn");

//Home Page Btns
footerNoteBtn.onclick = function() {
    if (notesList.length === 0) {
        emptyImg.classList.remove("d-none");
        emptyImg.style.position = "fixed";
        notesPage.classList.toggle("d-none")
        homePage.classList.toggle("d-none");
    } else {
        homePage.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
    }
};

homeFooterTrashBtn.onclick = function() {
    if(deletedNotesList.length === 0){
        emptyTrashImg.classList.remove("d-none");
        emptyTrashImg.style.position = "fixed";
        homePage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }else{
        homePage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }
}

sideNoteBtn.onclick = function() {
    if (notesList.length === 0) {
        homePage.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
        emptyImg.classList.remove("d-none");
        emptyImg.style.position = "fixed";
    } else {
        homePage.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
    }

}

sideTrashBtn.onclick = function(){
    if(deletedNotesList.length === 0){
        emptyTrashImg.classList.remove("d-none");
        emptyTrashImg.style.position = "fixed";
        homePage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }else{
        homePage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }
}



//Notes Page Btns
notesFooterHomeBtn.onclick = function() {
    homePage.classList.toggle("d-none");
    notesPage.classList.toggle("d-none")
}

notesTrashFooterBtn.onclick = function() {
    if(deletedNotesList.length === 0){
        emptyTrashImg.classList.remove("d-none");
        emptyTrashImg.style.position = "fixed";
        notesPage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }else{
        notesPage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }
}

sideNoteHomeBtn.onclick = function() {
    notesPage.classList.toggle("d-none")
    homePage.classList.toggle("d-none");
}

sideNoteTrashBtn.onclick = function (){
    if(deletedNotesList.length === 0){
        emptyTrashImg.classList.remove("d-none");
        emptyTrashImg.style.position = "fixed";
        notesPage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }else{
        emptyTrashImg.classList.add("d-none");
        notesPage.classList.toggle("d-none");
        trashPage.classList.toggle("d-none");
    }
}

//Trash Page Btns
trashFooterHomeBtn.onclick = function() {
    homePage.classList.add("d-none");
    trashPage.classList.remove("d-none");
}

trashNotesFooterBtn.onclick = function() {
    if (notesList.length === 0) {
        emptyImg.classList.remove("d-none");
        emptyImg.style.position = "fixed";
        notesPage.classList.toggle("d-none")
        trashPage.classList.toggle("d-none");
    } else {
        trashPage.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
    }
}

sideTrashHomeBtn.onclick = function(){
    homePage.classList.toggle("d-none");
    trashPage.classList.toggle("d-none");
}

sideTrashNoteBtn.onclick = function(){
    if (notesList.length === 0) {
        emptyImg.classList.remove("d-none");
        emptyImg.style.position = "fixed";
        notesPage.classList.toggle("d-none")
        trashPage.classList.toggle("d-none");
    } else {
        trashPage.classList.toggle("d-none");
        notesPage.classList.toggle("d-none");
    }
}

if (notesList.length === 0) {
    emptyImg.classList.remove("d-none");
}

if(deletedNotesList.length === 0){
    emptyTrashImg.classList.remove("d-none");
}