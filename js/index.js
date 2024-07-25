const SEARCH_DIV = document.querySelector("#search-div");
const ADD_DIV = document.querySelector("#add-div");
const LOG_DISPLAY = document.querySelector("console-out");
const BS_DISPLAY_CLASS = "d-block";
const BS_HIDE_CLASS = "d-none";

const SEARCH_BOOK_BTN = document.querySelector("#search-btn");

const ADD_BOOK_BTN = document.querySelector("#add-btn");
const ADD_RND_BTN = document.querySelector("#add-rnd-btn");
const GEN_ISBN_BTN = document.querySelector("#genIsbn-btn");

const TITLE_FIELD = document.querySelector("#add-title-field");
const AUTHOR_FIELD = document.querySelector("#add-author-field");
const ISBN_FIELD = document.querySelector("#add-isbn-field");

const LOG_ELEM = document.querySelector("#console-out");

const ENUM_LOG_TYPE = {
    "vryVerbose": 1,
    "verbose": 2,
    "log": 3,
    "warn": 4,
    "err": 5
}

const HELPER = {
    "htmlLog": function(string, logType = ENUM_LOG_TYPE.log) {
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
        if(LOG_ELEM.children.length == 0)
            LOG_ELEM.appendChild(document.createElement('div'));
        LOG_ELEM.children[0].appendChild(newLogEntry);
    }
}
//######################## TODO ##########################
function renderBooks() {
    let oList = document.createElement("ol");
    for(let book of books) {
        let liItem = createElement("li");
    }
}

document.querySelector("#home-nav").addEventListener("click", function() {
    ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
    ADD_DIV.classList.add(BS_HIDE_CLASS);
    SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
    SEARCH_DIV.classList.add(BS_HIDE_CLASS);
});

document.querySelector("#search-nav").addEventListener("click", function() {
    ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
    ADD_DIV.classList.add(BS_HIDE_CLASS);
    SEARCH_DIV.classList.remove(BS_HIDE_CLASS);
    SEARCH_DIV.classList.add(BS_DISPLAY_CLASS);
});

document.querySelector("#add-nav").addEventListener("click", function() {
    SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
    SEARCH_DIV.classList.add(BS_HIDE_CLASS);
    ADD_DIV.classList.remove(BS_HIDE_CLASS);
    ADD_DIV.classList.add(BS_DISPLAY_CLASS);
});

document.querySelector("#save-nav").addEventListener("click", async function() {
    if(await saveToJsonBin()) 
        HELPER.htmlLog("Save Successful!", helper.logType.log);
    else HELPER.htmlLog("Save Failed!", helper.logType.err);
});

document.querySelector("#log-clear-btn").addEventListener("click", function() {
    while(0 < LOG_ELEM.children.length)
        LOG_ELEM.removeChild(LOG_ELEM.children[0]); 
});

document.querySelector("#genIsbn-btn").addEventListener("click", function () {
    ISBN_FIELD.value = getRandomIsbn();
});

document.addEventListener("DOMcontentLoaded", function() {
    document.querySelector("#listing-loader").classList.remove(BS_DISPLAY_CLASS);
    document.querySelector("#listing-loader").classList.add(BS_HIDE_CLASS);
});
