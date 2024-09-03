const mainContainer = document.getElementById("mainContainer");
const form = document.getElementById("noteForm");
const noteList = document.querySelector(".noteList");
const formSubmitButton = document.getElementById("noteFormSubmit");
const formTitle = document.getElementById("noteFormTitle");

let editedNoteIndex = null;

const notes = [
    {
        title: "Raz dwa tzy aiosjd",
        description: "make",
        creationDate: new Date(),
    },
    {
        title: "Another note",
        description: "It",
        creationDate: new Date(),
    },
    {
        title: "Raz dwa tzy aiosjd",
        description: "typ",
        creationDate: new Date(),
    },
];

const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
    }).format(date);
};

const renderNotes = () => {
    noteList.innerHTML = "";

    if (!notes.length) {
        noteList.innerHTML = `
            <div class="emptyState">
                <div class="emptyState__circle">
                    <img src="/assets/info.svg" />
                </div>
                <div class="emptyState__title">No notes yet</div>
                <p class="emptyState__text">Add a note to keep track of your learnings.</p>
                <button onclick="showForm()" class="buttonOutline">
                    <img src="/assets/add.svg" /> Add Note
                </button>
            </div>
        `;
        return;
    }

    notes.forEach((note, index) => {
        const noteElement = document.createElement("div");

        const dateToRender = formatDate(note.creationDate);

        noteElement.className = "note";
        noteElement.innerHTML = `
            <div class="note__header">
                <h2 class="note__title">${note.title}</h2>
                <div class="note__buttonsContainer">
                    <button onclick="showForm(${index})" class="buttonGhost" aria-label="Edit note" title="Edit"><img src="/assets/edit.svg" /></button>
                    <button onclick="showConfirmDeleteModal()" class="buttonGhost" aria-label="Delete note" title="Delete"><img src="/assets/trash.svg" /></button>
                </div>
            </div>
            <p class="note__description">${note.description}</p>
            <div class="note__date">${dateToRender}</div>
        `;

        noteList.appendChild(noteElement);
    });
};

function showForm(index) {
    if (typeof index === "number" && notes[index]) {
        const { title, description } = notes[index];

        editedNoteIndex = index;

        formSubmitButton.innerText = "Save";
        formTitle.innerText = "Edit note";

        document.getElementById("noteTitle").value = title;
        document.getElementById("noteDescription").value = description;

        form.style.display = "flex";

        return;
    }

    formSubmitButton.innerHTML = "Add";
    formTitle.innerHTML = "Add new note";

    form.style.display = "flex";
}

function hideForm() {
    form.style.display = "none";

    editedNoteIndex = null;

    form.reset();
}

const addNote = (title, description) => {
    const newNote = {
        title,
        description,
        creationDate: new Date(),
    };

    notes.push(newNote);

    renderNotes();

    noteForm.reset();
    hideForm();
};

const editNote = (title, description) => {
    const note = notes[editedNoteIndex];

    const newNote = {
        ...note,
        title,
        description,
    };

    notes[editedNoteIndex] = newNote;

    renderNotes();

    noteForm.reset();
    hideForm();
};

function deleteNote(index) {
    notes.splice(index, 1);

    closeConfirmDeleteModal();
    renderNotes();
}

function showConfirmDeleteModal(index) {
    const modal = document.createElement("div");

    modal.className = "modal";
    modal.id = "modal";
    modal.innerHTML = `
        <div class="modal__overlay">
            <div class="modal__content">
                <div class="modal__title">Delete Note</div>
                <div class="modal__text">Are you sure you want to delete this note?</div>
                <div class="modal__buttonsContainer">
                    <button onclick="closeConfirmDeleteModal()" type="button" class="buttonOutline">Cancel</button>
                    <button onclick="deleteNote(${index})" type="button" class="buttonPrimary">Delete</button>
                </div>
            </div>
        </div>
    `;

    mainContainer.appendChild(modal);
}

function closeConfirmDeleteModal() {
    const modal = document.getElementById("modal");

    modal.remove();
}

const handleFormSubmit = (event) => {
    event.preventDefault();

    const { value: title } = document.getElementById("noteTitle");
    const { value: description } = document.getElementById("noteDescription");

    if (typeof editedNoteIndex === "number") {
        editNote(title, description);
        return;
    }

    addNote(title, description);
};

noteForm.addEventListener("submit", handleFormSubmit);
renderNotes();
