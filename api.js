const API_URL =
    "https://jsonplaceholder.typicode.com/posts";

const loadButton =
    document.querySelector("#load-btn");

const statusElement =
    document.querySelector("#status");

const notesList =
    document.querySelector("#notes-list");

const noteForm =
    document.querySelector("#note-form");

const titleInput =
    document.querySelector("#title-input");

const bodyInput =
    document.querySelector("#body-input");

const submitButton =
    document.querySelector("#submit-btn");


async function request(
    url,
    options = {}
) {
    const response =
        await fetch(url, options);

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return response;
}


function createNoteElement(note) {

    const item =
        document.createElement("li");

    item.classList.add(
        "note-card"
    );

    const title =
        document.createElement("h3");

    title.textContent =
        note.title;

    const body =
        document.createElement("p");

    body.textContent =
        note.body;

    item.append(
        title,
        body
    );

    return item;
}


function renderNotes(notes) {

    notesList.replaceChildren();

    if (notes.length === 0) {

        const item =
            document.createElement("li");

        item.textContent =
            "No notes available.";

        notesList.append(item);

        return;
    }

    notes.forEach(note => {

        const item =
            createNoteElement(note);

        notesList.append(item);

    });
}


async function loadNotes() {

    statusElement.className = "";

    statusElement.textContent =
        "Loading notes...";

    loadButton.disabled = true;

    try {

        const response =
            await request(
                `${API_URL}?_limit=10`
            );

        const notes =
            await response.json();

        renderNotes(notes);

        statusElement.classList.add(
            "success"
        );

        statusElement.textContent =
            `Loaded ${notes.length} notes from the server.`;

    }
    catch (error) {

        notesList.replaceChildren();

        statusElement.classList.add(
            "error"
        );

        statusElement.textContent =
            "Unable to load notes.";

        console.error(error);

    }
    finally {

        loadButton.disabled = false;

    }
}


async function createNote(event) {

    event.preventDefault();

    statusElement.className = "";

    const title =
        titleInput.value.trim();

    const body =
        bodyInput.value.trim();

    if (title === "") {

        statusElement.classList.add(
            "error"
        );

        statusElement.textContent =
            "Title is required.";

        return;
    }

    if (title.length > 100) {

        statusElement.classList.add(
            "error"
        );

        statusElement.textContent =
            "Title must be 100 characters or fewer.";

        return;
    }

    submitButton.disabled = true;

    try {

        const response =
            await request(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        body,
                        userId: 1
                    })
                }
            );

        const newNote =
            await response.json();

        const noteElement =
            createNoteElement(newNote);

        notesList.prepend(
            noteElement
        );

        statusElement.classList.add(
            "success"
        );

        statusElement.textContent =
            `Note created (status ${response.status}, id ${newNote.id}).`;

        noteForm.reset();

    }
    catch (error) {

        statusElement.classList.add(
            "error"
        );

        statusElement.textContent =
            "Unable to create note.";

        console.error(error);

    }
    finally {

        submitButton.disabled =
            false;

    }
}


loadButton.addEventListener(
    "click",
    loadNotes
);

noteForm.addEventListener(
    "submit",
    createNote
);