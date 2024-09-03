const mainContainer = document.getElementById("mainContainer");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("noteForm");
const noteList = document.querySelector(".noteList");
const formSubmitButton = document.getElementById("noteFormSubmit");
const formTitle = document.getElementById("noteFormTitle");

let editedNoteId = null;

let notes = [
    {
        id: getId(),
        title: "Raz dwa tzy aiosjd",
        description: "make",
        creationDate: new Date(),
    },
    {
        id: getId(),
        title: "Another note",
        description: "It",
        creationDate: new Date(),
    },
    {
        id: getId(),
        title: "Raz dwa tzy aiosjd",
        description: "typ",
        creationDate: new Date(),
    },
];

function getId() {
    return Math.random().toString().split(".")[1].slice(0, 5);
}

function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
    }).format(date);
}

function renderNotes(filterQuery) {
    filterQuery = searchInput.value;
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

    const filteredNotes = filterQuery
        ? notes.filter((note) => {
              return (
                  note.title.toLowerCase().includes(filterQuery) ||
                  note.description.toLowerCase().includes(filterQuery)
              );
          })
        : notes;

    if (filterQuery && !filteredNotes.length) {
        noteList.innerHTML = `
        <div class="emptyState">
            <div class="emptyState__circle">
                <img src="/assets/info.svg" />
            </div>
            <div class="emptyState__title">No results</div>
            <p class="emptyState__text">Try to change the filter.</p>
        </div>
    `;
        return;
    }

    filteredNotes.forEach((note) => {
        const noteElement = document.createElement("div");

        const { id, title, description } = note;

        const dateToRender = formatDate(note.creationDate);

        noteElement.className = "note";
        noteElement.innerHTML = `
            <div class="note__header">
                <h2 class="note__title">${title}</h2>
                <div class="note__buttonsContainer">
                    <button onclick="showForm(${id})" class="buttonGhost" aria-label="Edit note" title="Edit"><img src="/assets/edit.svg" /></button>
                    <button onclick="showConfirmDeleteModal(${id})" class="buttonGhost" aria-label="Delete note" title="Delete"><img src="/assets/trash.svg" /></button>
                </div>
            </div>
            <p class="note__description">${description}</p>
            <div class="note__date">${dateToRender}</div>
        `;

        noteList.appendChild(noteElement);
    });
}

function showForm(id) {
    id = id ? id.toString() : undefined;

    if (id) {
        const note = notes.find((note) => note.id === id);

        if (!note) return;

        const { title, description } = note;

        editedNoteId = id;

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

    editedNoteId = null;

    form.reset();
}

function addNote(title, description) {
    const newNote = {
        id: getId(),
        title,
        description,
        creationDate: new Date(),
    };

    notes.push(newNote);

    renderNotes();

    noteForm.reset();
    hideForm();
}

function editNote(title, description) {
    const note = notes.find((note) => note.id === editedNoteId);

    if (!note) return;

    const newNote = {
        ...note,
        title,
        description,
    };

    notes = notes.map((note) => {
        if (note.id === editedNoteId) {
            return newNote;
        }

        return note;
    });

    renderNotes();

    noteForm.reset();
    hideForm();
}

function deleteNote(id) {
    id = id ? id.toString() : undefined;

    notes = notes.filter((note) => note.id !== id);

    closeConfirmDeleteModal();
    renderNotes();
}

function showConfirmDeleteModal(id) {
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
                    <button onclick="deleteNote(${id})" type="button" class="buttonPrimary">Delete</button>
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

function handleFormSubmit(event) {
    event.preventDefault();

    const { value: title } = document.getElementById("noteTitle");
    const { value: description } = document.getElementById("noteDescription");

    if (editedNoteId) {
        editNote(title, description);
        return;
    }

    addNote(title, description);
}

function filterNotes(event) {
    const query = event.target.value.toLowerCase();

    renderNotes(query);
}

searchInput.addEventListener("input", filterNotes);

noteForm.addEventListener("submit", handleFormSubmit);
renderNotes();
