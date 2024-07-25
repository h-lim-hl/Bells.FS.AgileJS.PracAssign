const SEARCH_NAV = document.querySelector("#search-nav");
const ADD_NAV = document.querySelector("#add-nav");
const SEARCH_DIV = document.querySelector("#search-div");
const ADD_DIV = document.querySelector("#add-div");
const LOG_DISPLAY = document.querySelector("console-out");
const BS_DISPLAY_CLASS = "d-block";
const BS_Hide_CLASS = "d-none";

const SEARCH_BOOK_BTN = document.querySelector("#search-btn");

const ADD_BOOK_BTN = document.querySelector("#add-btn");
const ADD_RND_BTN = document.querySelector("#add-rnd-btn");
const GEN_ISBN_BTN = document.querySelector("#genIsbn-btn");

const CLEAR_LOG_BTN = document.querySelector("#log-clear-btn");
const LOG_ELEM = document.querySelector("#console-out");


SEARCH_NAV.addEventListener("click", function() {
    ADD_DIV.classList.remove(BS_DISPLAY_CLASS);
    ADD_DIV.classList.add(BS_Hide_CLASS);
    SEARCH_DIV.classList.remove(BS_Hide_CLASS);
    SEARCH_DIV.classList.add(BS_DISPLAY_CLASS);
});

ADD_NAV.addEventListener("click", function() {
    SEARCH_DIV.classList.remove(BS_DISPLAY_CLASS);
    SEARCH_DIV.classList.add(BS_Hide_CLASS);
    ADD_DIV.classList.remove(BS_Hide_CLASS);
    ADD_DIV.classList.add(BS_DISPLAY_CLASS);
});


CLEAR_LOG_BTN.addEventListener("click", function() {
    LOG_ELEM.innerHTML = "";
});

