const API_URL =
    "https://jsonplaceholder.typicode.com/posts";

const loadButton =
    document.querySelector("#load-btn");

const statusElement =
    document.querySelector("#status");

const notesList =
    document.querySelector("#notes-list");

/*
Reusable request helper
*/
async function request(url, options = {}) {
    const response =
        await fetch(url, options);

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return response;
}

/*
Renders notes
*/
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
            document.createElement("li");

        item.classList.add("note-card");

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

        notesList.append(item);
    });
}

/*
Load notes
*/
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

    } catch (error) {

        notesList.replaceChildren();

        statusElement.classList.add(
            "error"
        );

        statusElement.textContent =
            "Unable to load notes.";

        console.error(error);

    } finally {

        loadButton.disabled = false;
    }
}

loadButton.addEventListener(
    "click",
    loadNotes
);