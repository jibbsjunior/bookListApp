// Book class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI tasks
class UI {
    static displayBooks() {
        const book = Store.getBooks();

        books.forEach(book => {
            UI.addBookToList(book)
        });
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish after 3 seconds
        setTimeout(
            () => document.querySelector('.alert').remove(),
            3000);
    }
    static clearFields() {
        document.querySelector('#title').value = " ";
        document.querySelector('#Author').value = " ";
        document.querySelector('#ISBN').value = " ";
    }
}

// Store class: Handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;

    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify('books'));
    }
}

// Event: Display Books
document.addEventListener('DomContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', e => {
    // prevent actual submit
    e.preventDefault();
    // Get Form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#Author').value;
    const isbn = document.querySelector('#ISBN').value;

    // form validation
    if (title === '' || author === "" || isbn === "") {
        UI.showAlert("please fill out all fields", 'info');
    } else {

        // Instantiate book
        const book = new Book(title, author, isbn);
        // console.log(book);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);


        // show success message
        UI.showAlert('Book Added', 'success');

        // clear fileds
        UI.clearFields();
    }

});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', e => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // show success message
    UI.showAlert('Book removed', 'success');
});