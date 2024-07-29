/*  ########################### TODO
    Add a feature to search for books by title or author.
    
    Use Date type for "late return" feature
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
*/

const GENERATOR = {
    "authorPool": ["Yasu Ekundayo", "Uzoma Karuna", "Shams Andie", "Baako Jip",
        "Qing Gerry", "Lebohang Nitya", "Ulloriaq Balwinder"],

    "bookTitlePool": ["Slave Of The East", "Rebel Of The Mountain", "Horses Of Perfection",
        "Aliens Of Fire", "Children And Warriors", "Robots And Doctors",
        "Intention With A Goal", "Luck Without A Conscience",
        "Forsaken By The West", "Visiting The West"]
};

const JSON_BIN_ROOT = "https://api.jsonbin.io/v3"
const JSON_BIN_ID = "66a22c98ad19ca34f88c95a7";
const JSON_BIN_BIN = JSON_BIN_ROOT + /b/ + JSON_BIN_ID;

let books = [];
let uidCount = -1;
let isValid = false; // if initial load is successful

function Book(title, author, isbn) {
    return {
        "uid": ++uidCount,
        "title": title,
        "author": author,
        "isbn": isbn,
    };
}

/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} arg A number to do something to.
 */

function extractIsbnSymbols(str) {
    const regex = /(\d|[xX]+)/g;
    let capture = str.match(regex);
    return (capture == null || capture.length < 1) ? "" : capture.join('');
}

function sumIsbn10Num(isbn, start = 0, end = -1) {
    let sum = 0;

    // check number length
    if (isbn.length != 10) {
        console.log("sumIsbn13Num(): input is not an ISBN-10 number!");
        return -1;
    }

    // check if not custom end
    if (end == -1) {
        end = 10;
    }

    // sum from left to right isbn[n] * (10 - n)
    // so n = 1 : isbn[1] * 9
    // if isbn[n] is X then isbn[n] = 10
    for (; end <= start; ++start) {
        if (isbn[start].toLowerCase() == 'x') {
            sum += 10 * (10 - start);
        }
        else {
            sum += parseInt(isbn[start]) * (10 - start);
        }
    }

    if (sum == NaN) console.log("sumIsbn10Num(): sum error!");

    return sum;
}

function sumIsbn13Num(isbn, start = 0, end = -1) {
    let sum = 0;

    // check number length
    if (isbn.length != 13) {
        console.log("sumIsbn13Num(): input is not an ISBN-13 number!");
        return -1;
    }

    // sum from left to right if digit place is odd: sum += 1, else: sum += 3
    if (end == -1) end = isbn.length;
    for (; start < end; ++start) {
        sum += parseInt(isbn[start]) * ((start % 2 == 0) ? 1 : 3);
    }

    if (sum == NaN) console.log("sumIsbn13Num() sum error!");

    return sum;
}

/*******************************************************************************
* Function Name: validateIsbn
* Param (isbn): String that represents a possible isbn
* Return: true if given isbn is valid, false otherwise.
* Description:
*   Formula for ISBN-10 check is Sum(digit * nthPlaceFromRight) | 11
*   Formula for ISBN-13 check is
*     (Sum(evenPlaceDigit) + Sum(oddPlaceDigit*3)) | 10
*******************************************************************************/

function validateIsbn(isbn) {
    isbn = extractIsbnSymbols(isbn);
    //console.log(isbn);
    if (isbn.length == 10) {
        return sumIsbn10Num(isbn) % 11 == 0;
    }
    else if (isbn.length == 13) {
        return (sumIsbn13Num(isbn) % 10 == 0);
    }
    //console.log("validateIsbn(): invalid length!")
    return false;
}

function getRandomIsbn(is13Long = false) {
    const BREAKSYMBOL = '-';
    let newIsbn = "";
    let randNum =
        String(Math.floor(Math.random() * 10 ** 9)).padStart(9, '0');

    if (is13Long) {
        const FIXEDTHREE = "978";

        newIsbn = FIXEDTHREE + randNum;

        // console.log(newIsbn);

        let sum = 0;
        for (let i = 0; i < newIsbn.length; ++i) {
            sum += parseInt(newIsbn[i]) * ((i % 2 == 0) ? 1 : 3);
        }

        newIsbn += String(10 - (sum % 10));
    }
    else {

        // console.log(randNum);

        let sum = 0;
        for (let start = 0; randNum.length < start; ++start) {
            sum += parseInt(randNump[start]) * (10 - start);
        }

        let checkValue = sum % 11;
        newIsbn = randNum + (checkValue == 10 ? 'X' : checkValue);
    }
    return newIsbn;
}

function validateBook(book) {
    return (validateIsbn(book.isbn));
}

function addBook(books, book) {
    if (validateBook(book)) {
        books.push(book);
        // console.log(`New Book ${book.title} added`);
        return true;
    } else {
        // console.log("Book Data is invalid or ISBN is not unique!");
        return false;
    }
}

function addBookCustom(books, title, author, isbn) {
    let newBook = {
        "uid": ++uidCount,
        title: title,
        author: author,
        isbn: isbn,
    };
    return addBook(books, newBook);
}

function addRandomBook(books) {
    addBookCustom(books,
        GENERATOR.bookTitlePool[Math.floor(Math.random()
            * GENERATOR.bookTitlePool.length)],
        GENERATOR.authorPool[Math.floor(Math.random()
            * GENERATOR.authorPool.length)],
        getRandomIsbn()
    );
}

function addNewBook(books, getRandomIsbn = false) {
    let title = prompt("Enter book title: ");
    let author = prompt("Enter book author: ");
    let isbn = prompt("Enter book ISBN: ");

    if (getRandomIsbn) isbn = getRandomIsbn();

    let newbook = {
        title: title,
        author: author,
        isbn: isbn,
        isCheckedOut: false

    };

    addBook(books, newbook);
}

function getBookIndexByUID(books, uid) {
    let index = -1;
    for (let i = 0; i < books.length; ++i) {
        if (books[i].uid == uid) {
            index = i;
            break;
        }
    }
    return index;
}

function removeBookByIndex(books, index) {
    if (-1 < index && index < books.length) {
        books.splice(index, 1);
    }
}

function updateBookDataByIndex(books, index, title, author, isbn) {
    if (validateIsbn(isbn)) {
        books[index].title = title;
        books[index].author = author;
        books[index].isbn = isbn;
    }
    else return false;
}

async function loadData() {
    let result = false;

    await axios.get(JSON_BIN_BIN + "/latest")
        .then(function (response) {
            uidCount = parseInt(response.record.uidCount);
            books = response.record.books;
            result = true;
        })
        .catch(function (err) {
            console.log(`${err}\naxios.get() failed!`);
        });
    return result;
}

async function saveToJsonBin() {
    if (!isValid) {
        console.log("User tried to save while having err data set!");
        return false; // initial data pull failed.
    }
    let result = false;
    let json = {
        "uidCount": uidCount,
        "books": books
    };

    await axios.put(JSON_BIN_BIN, json.toString())
        .then(function (reponse) {
            result = true;
        })
        .catch(function (err) {
            console.log(`${err}\naxios.put() failed!`);
        });

    return result;
}
//App();

//console.log(validateIsbn("978-1-408-85565-2"));
//console.log(validateIsbn("0-14242417X"));

// let isbn = getRandomIsbn();
// console.log(isbn);
// console.log(validateIsbn(isbn));
//let testBooks = [];
//for(let i =  0; i < 10; ++i) addRandomBook(testBooks);
// console.log(testBooks);
//showAllBook(testBooks);

// let test = Date.now();
// console.log(test);

//console.log(new Book("Hello World", "Blue Banana", "1234567890"));