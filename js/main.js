const form = document.getElementById("noteForm");
const noteList = document.querySelector(".noteList");

const notes = [
    // {
    //     title: "Raz dwa tzy aiosjd",
    //     description:
    //         "make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets contain",
    //     creationDate: new Date(),
    // },
    // {
    //     title: "Another note",
    //     description:
    //         "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using",
    //     creationDate: new Date(),
    // },
    // {
    //     title: "Raz dwa tzy aiosjd",
    //     description:
    //         "make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets contain",
    //     creationDate: new Date(),
    // },
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
                    <button class="buttonGhost" aria-label="Edit note"><img src="/assets/edit.svg" /></button>
                    <button onclick="deleteNote(${index})" class="buttonGhost" aria-label="Delete note"><img src="/assets/trash.svg" /></button>
                </div>
            </div>
            <p class="note__description">${note.description}</p>
            <div class="note__date">${dateToRender}</div>
        `;

        noteList.appendChild(noteElement);
    });
};

function showForm() {
    form.style.display = "flex";
}

function hideForm() {
    form.style.display = "none";
}

const addNote = (event) => {
    event.preventDefault();

    const { value: title } = document.getElementById("noteTitle");
    const { value: description } = document.getElementById("noteDescription");
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

function deleteNote(index) {
    // if (confirm('Are you sure you want to delete this note?')) {
    notes.splice(index, 1);
    // saveNotes();
    renderNotes();
    // }
}

noteForm.addEventListener("submit", addNote);
renderNotes();
