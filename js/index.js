const SEARCH_DIV = document.querySelector("#search-div");
const ADD_DIV = document.querySelector("#add-div");
const EDIT_DIV = document.querySelector("#edit-div");
const LISTING_DIV = document.querySelector("#listing-div");

const LOG_DISPLAY = document.querySelector("console-out");
const BS_DISPLAY_CLASS = "d-block";
const BS_HIDE_CLASS = "d-none";

const SEARCH_BOOK_BTN = document.querySelector("#search-btn");

const ADD_TITLE_FIELD = document.querySelector("#add-title-field");
const ADD_AUTHOR_FIELD = document.querySelector("#add-author-field");
const ADD_ISBN_FIELD = document.querySelector("#add-isbn-field");

const EDIT_TITLE_FIELD = document.querySelector("#edit-title-field");
const EDIT_AUTHOR_FIELD = document.querySelector("#edit-author-field");
const EDIT_ISBN_FIELD = document.querySelector("#edit-isbn-field");

const LOG_ELEM = document.querySelector("#console-out");

const IS_LIVE = false;

const ENUM_LOG_TYPE = {
    "vryVerbose": 1,
    "verbose": 2,
    "log": 3,
    "warn": 4,
    "err": 5
}

const HELPER = {
    "htmlLog": function (string, logType = ENUM_LOG_TYPE.log) {
        let newLogEntry = document.createElement('p');
        let color = "";
        switch (logType) {
            case ENUM_LOG_TYPE.vryVerbose:
            case ENUM_LOG_TYPE.verbose:
                color = "green";
                break;
            case ENUM_LOG_TYPE.warn:
                color = "yellow";
            case ENUM_LOG_TYPE.err:
                color = "red";
                break;
            case ENUM_LOG_TYPE.log:
            default:
                color = "black";
                break;
        };
        newLogEntry.innerHTML = string;
        newLogEntry.style.color = color;
        if (LOG_ELEM.children.length == 0)
            LOG_ELEM.appendChild(document.createElement('div'));
        LOG_ELEM.children[0].appendChild(newLogEntry);
    }
}

function renderBooks() {
    if (0 < LISTING_DIV.children.length)
        LISTING_DIV.removeChild(LISTING_DIV.children[0]);

    let oList = document.createElement("ol");
    oList.className = "list-group-item list-group-numbered"
    for (let book of books) {
        let liItem = document.createElement("li");
        liItem.innerHTML = `${book.title} By ${book.author}`;
        liItem.className = "list-group-item ms-2 py-3";

        let btn = document.createElement("button");
        btn.className = "btn btn-danger delete-btn";
        btn.dataset.uid = book.uid;
        btn.style.cssFloat = "right";
        let btnLabel = document.createElement("label");
        btnLabel.innerHTML = "Delete";
        btn.appendChild(btnLabel);
        liItem.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "btn btn-secondary mx-1 edit-btn";
        btn.dataset.uid = book.uid;
        btn.style.cssFloat = "right";
        btnLabel = document.createElement("label");
        btnLabel.innerHTML = "Edit";
        btn.appendChild(btnLabel);
        liItem.appendChild(btn);

        oList.appendChild(liItem);
    }
    let listWrapper = document.createElement("div");
    listWrapper.className = "column";
    listWrapper.appendChild(oList);
    LISTING_DIV.appendChild(listWrapper);

    // EDIT BUTTON
    for (let btn of document.querySelectorAll(".edit-btn")) {
        btn.addEventListener("click", function () {
            ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
            ADD_DIV.classList.add(BS_HIDE_CLASS);
            SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
            SEARCH_DIV.classList.add(BS_HIDE_CLASS);
            EDIT_DIV.classList.remove(BS_HIDE_CLASS);
            EDIT_DIV.classList.add(BS_DISPLAY_CLASS);
            
            let uid = btn.dataset.uid;
            let index = getBookIndexByUID(books, uid);
            if((-1 < index) && (index < books.length)) {
                let book = books[index];
                EDIT_TITLE_FIELD.value = book.title;
                EDIT_AUTHOR_FIELD.value = book.author;
                EDIT_ISBN_FIELD.value = book.isbn;
            } else { 
                HELPER.htmlLog(`Book UID:${uid} was not found!`, ENUM_LOG_TYPE.err);
            }
        });
    }
}

document.querySelector("#home-nav").addEventListener("click", function () {
    ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
    ADD_DIV.classList.add(BS_HIDE_CLASS);
    SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
    SEARCH_DIV.classList.add(BS_HIDE_CLASS);
    EDIT_DIV.classList.add(BS_HIDE_CLASS);
    EDIT_DIV.classList.remove(BS_DISPLAY_CLASS);
});

/* To do later after all basic features complete
document.querySelector("#search-nav").addEventListener("click", function () {
    ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
    ADD_DIV.classList.add(BS_HIDE_CLASS);
    SEARCH_DIV.classList.remove(BS_HIDE_CLASS);
    SEARCH_DIV.classList.add(BS_DISPLAY_CLASS);
    EDIT_DIV.classList.add(BS_HIDE_CLASS);
    EDIT_DIV.classList.remove(BS_DISPLAY_CLASS);
});
*/

document.querySelector("#add-nav").addEventListener("click", function () {
    SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
    SEARCH_DIV.classList.add(BS_HIDE_CLASS);
    ADD_DIV.classList.remove(BS_HIDE_CLASS);
    ADD_DIV.classList.add(BS_DISPLAY_CLASS);
    EDIT_DIV.classList.add(BS_HIDE_CLASS);
    EDIT_DIV.classList.remove(BS_DISPLAY_CLASS);
});

document.querySelector("#save-nav").addEventListener("click", async function () {
    if(!IS_LIVE) {
        HELPER.htmlLog("Save Button Pressed!", helper.logType.log);
        return;
    }
    if (await saveToJsonBin())
        HELPER.htmlLog("Save Successful!", helper.logType.verbose);
    else HELPER.htmlLog("Save Failed!", helper.logType.err);
});

document.querySelector("#log-clear-btn").addEventListener("click", function () {
    while (0 < LOG_ELEM.children.length)
        LOG_ELEM.removeChild(LOG_ELEM.children[0]);
});

document.querySelector("#genIsbn-btn").addEventListener("click", function () {
    ADD_ISBN_FIELD.value = getRandomIsbn();
});


document.querySelector("#add-btn").addEventListener("click", function() {
    let isbn = ADD_ISBN_FIELD.value;
    if(validateIsbn(isbn) == false)
    {
        HELPER.htmlLog("ISBN is invalid!", ENUM_LOG_TYPE.err);
        return;
    }

    let title = ADD_TITLE_FIELD.value;
    let author = ADD_AUTHOR_FIELD.value;
    if(0 < title.length  || 0 < author.length) {
        addBookCustom(books, title, author, isbn);
        HELPER.htmlLog("Book added!", ENUM_LOG_TYPE.verbose);
        renderBooks();
        ADD_ISBN_FIELD.value = ADD_TITLE_FIELD.value = ADD_AUTHOR_FIELD.value = "";
    } else {
        HELPER.htmlLog("Title and Author cannot be empty!", ENUM_LOG_TYPE.err);
    }
});

document.querySelector("#add-rnd-btn").addEventListener("click", function () {
    addRandomBook(books);
    HELPER.htmlLog("Random Book added!", ENUM_LOG_TYPE.verbose);
    renderBooks();
});

document.addEventListener("DOMContentLoaded", async function () {
    if(IS_LIVE) {
        document.querySelector("#listing-loader").classList.remove(BS_HIDE_CLASS);
        document.querySelector("#listing-loader").classList.add(BS_DISPLAY_CLASS);

        await loadData();
    }
    document.querySelector("#listing-loader").classList.remove(BS_DISPLAY_CLASS);
    document.querySelector("#listing-loader").classList.add(BS_HIDE_CLASS);
});


for(let _ = 0; _ < 3; ++_) addRandomBook(books);
console.log(books);
renderBooks();