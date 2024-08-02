const SEARCH_DIV = document.querySelector("#search-div");
const ADD_DIV = document.querySelector("#add-div");
const EDIT_DIV = document.querySelector("#edit-div");
const NAV_ELEMENTS = [SEARCH_DIV, ADD_DIV, EDIT_DIV];

const LISTING_DIV = document.querySelector("#listing-div");
const LISTING_LOADER_DIV = document.querySelector("#listing-loader");
const BOOK_DISPLAY_ELEMENTS = [LISTING_DIV, LISTING_LOADER_DIV];

const LOG_DISPLAY = document.querySelector("console-out");
const BS_DISPLAY_CLASS = "d-block";
const BS_HIDE_CLASS = "d-none";

const SEARCH_BOOK_BTN = document.querySelector("#search-btn");

const UPDATE_BOOK_BTN = document.querySelector("#edit-btn");
let update_action_space = { "bookIndex": -1 };

const ADD_TITLE_FIELD = document.querySelector("#add-title-field");
const ADD_AUTHOR_FIELD = document.querySelector("#add-author-field");
const ADD_ISBN_FIELD = document.querySelector("#add-isbn-field");

const EDIT_TITLE_FIELD = document.querySelector("#edit-title-field");
const EDIT_AUTHOR_FIELD = document.querySelector("#edit-author-field");
const EDIT_ISBN_FIELD = document.querySelector("#edit-isbn-field");

const LOG_ELEM = document.querySelector("#console-out");

const IS_LIVE = true;

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

        while (0 < LOG_ELEM.children.length)
            LOG_ELEM.removeChild(LOG_ELEM.children[0]);

        LOG_ELEM.appendChild(document.createElement('div'));
        LOG_ELEM.children[0].appendChild(newLogEntry);
    }
}

function divShowOnly(divElemArr, element) {
    for(let elem of divElemArr) {
        if(element === elem) {
            elem.classList.add(BS_DISPLAY_CLASS);
            elem.classList.remove(BS_HIDE_CLASS);
        } else {
            elem.classList.remove(BS_DISPLAY_CLASS);
            elem.classList.add(BS_HIDE_CLASS);
        }
    }
}

function divHideAll(divELemArr) {
    for(let elem of divELemArr) {
        elem.classList.remove(BS_DISPLAY_CLASS);
            elem.classList.add(BS_HIDE_CLASS);
    }
}

function renderBooks() {
    if (0 < LISTING_DIV.children.length)
        LISTING_DIV.removeChild(LISTING_DIV.children[0]);

    let mainDiv = document.createElement("div");
    mainDiv.className = "column";
    let bookCount = 0;
    for (let book of books) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "row align-items-center"
        
        let titleDiv = document.createElement("div");
        titleDiv.className = "col-6 ms-2 py-3";
        titleDiv.innerHTML = `${++bookCount}. ${book.title} By ${book.author}`;
        itemDiv.appendChild(titleDiv);

        let btnDiv = document.createElement("div");
        btnDiv.className = "col-4"

        let btn = document.createElement("button");
        btn.className = "btn btn-secondary mx-1 edit-btn";
        btn.dataset.uid = book.uid;
        let btnLabel = document.createElement("label");
        btnLabel.innerHTML = "Edit";
        btn.appendChild(btnLabel);
        btnDiv.appendChild(btn);
        
        btn = document.createElement("button");
        btn.className = "btn btn-danger delete-btn";
        btn.dataset.uid = book.uid;
        btnLabel = document.createElement("label");
        btnLabel.innerHTML = "Delete";
        btn.appendChild(btnLabel);
        btnDiv.appendChild(btn);
        
        itemDiv.appendChild(btnDiv);
        mainDiv.appendChild(itemDiv);
    }
    LISTING_DIV.appendChild(mainDiv);

    // EDIT BUTTON
    for (let btn of document.querySelectorAll(".edit-btn")) {
        btn.addEventListener("click", function () {
            divShowOnly(NAV_ELEMENTS, EDIT_DIV);
            
            let uid = btn.dataset.uid;
            let index = getBookIndexByUID(books, uid);
            if((-1 < index) && (index < books.length)) {
                let book = books[index];
                EDIT_TITLE_FIELD.value = book.title;
                EDIT_AUTHOR_FIELD.value = book.author;
                EDIT_ISBN_FIELD.value = book.isbn;
                update_action_space.bookIndex = index;
            } else { 
                HELPER.htmlLog(`Book UID:${uid} was not found!`, ENUM_LOG_TYPE.err);
            }
        });
    }

    // DELETE BUTTON
    for(let btn of document.querySelectorAll(".delete-btn")) {
        btn.addEventListener("click", function () {
            let uid = btn.dataset.uid;
            let index = getBookIndexByUID(books, uid);
            let tempBook = books[index]; 
            if(
                confirm(`Delete ${books[index].title} By ${books[index].author}?`)
            ){
                removeBookByIndex(books, index);
                renderBooks();
                HELPER.htmlLog(`Book ${tempBook.title} removed!`, ENUM_LOG_TYPE.warn);
            }
        });
    };
}

UPDATE_BOOK_BTN.addEventListener("click", function () {
    let bookIndex = update_action_space.bookIndex;

    if(bookIndex < 0 && books.length <= bookIndex) {
        HELPER.htmlLog("Unable to Update Book!",ENUM_LOG_TYPE.err);
        EDIT_TITLE_FIELD.value = EDIT_AUTHOR_FIELD.value =
        EDIT_ISBN_FIELD.value = "";
        return;
    }
    if(!validateIsbn(EDIT_ISBN_FIELD.value)) {
        HELPER.htmlLog("Book ISBN is invalid!",ENUM_LOG_TYPE.err);
        return;
    } 
    books[bookIndex].title = EDIT_TITLE_FIELD.value;
    books[bookIndex].author = EDIT_AUTHOR_FIELD.value;
    books[bookIndex].isbn = EDIT_ISBN_FIELD.value;
    EDIT_TITLE_FIELD.value = EDIT_AUTHOR_FIELD.value = EDIT_ISBN_FIELD.value = ""; 
    HELPER.htmlLog(`Book "${books[bookIndex].title}" Updated!`,
         ENUM_LOG_TYPE.verbose);
    divHideAll(NAV_ELEMENTS);
    renderBooks();
});

document.querySelector("#home-nav").addEventListener("click", function () {
    divHideAll(NAV_ELEMENTS);
});

/* To do later after all basic features complete
document.querySelector("#search-nav").addEventListener("click", function () {
    divShowOnly(NAV_ELEMENTS, SEARCH_DIV);
});
*/

document.querySelector("#add-nav").addEventListener("click", function () {
    divShowOnly(NAV_ELEMENTS, ADD_DIV);
});

document.querySelector("#save-nav").addEventListener("click", async function () {
    if (await saveToJsonBin())
        HELPER.htmlLog("Save Successful!", ENUM_LOG_TYPE.verbose);
    else HELPER.htmlLog("Save Failed!", ENUM_LOG_TYPE.err);
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
        divShowOnly(BOOK_DISPLAY_ELEMENTS, LISTING_LOADER_DIV);
        
        await loadData();
        renderBooks();
        divShowOnly(BOOK_DISPLAY_ELEMENTS, LISTING_DIV);

        HELPER.htmlLog("Book List Loaded!", ENUM_LOG_TYPE.log);

    } else {
        divShowOnly(BOOK_DISPLAY_ELEMENTS, LISTING_LOADER_DIV);

        setTimeout(() => {
            divShowOnly(BOOK_DISPLAY_ELEMENTS, LISTING_DIV);

            for(let _ = 0; _ < 3; ++_) addRandomBook(books);
            console.log(books);
            renderBooks();

            HELPER.htmlLog("Book List Loaded - offline!", ENUM_LOG_TYPE.log);
        }, 2000);
    }

});


// ################################
document.querySelector("#Debug").addEventListener("click", function() {
    console.log(`uidCount: ${uidCount}`);
    console.log(`books: ${books}`);
});