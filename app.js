const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('txt-search');
const mainContent = document.querySelector('.main-content');
const bookList = document.getElementById('books-list');

// load books in my list

if (localStorage.getItem('myBooks')) {
	let books = JSON.parse(localStorage.getItem('myBooks'));
	showList(books);
	showReadBooks(books);
	showWishBooks(books);
}

searchForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	// clear exising list of books
	bookList.innerHTML = '';

	document.querySelector('h1').classList.add('searching');

	let rawString = searchInput.value;
	let formatedStr = rawString.replace(/\s/g, '+');
	//const booksList=document.getElementById('books-list')

	const response1 = await fetch(
		'http://openlibrary.org/search.json?title=' + formatedStr
	);
	const data1 = await response1.json();
	const response2 = await fetch('http://localhost:5000/api/v1/rating');
	const data2 = await response2.json();

	console.log(data1);
	console.log(data2);
	////////////////////////// DATA 1 /////////////////////

	document.querySelector('h1').classList.remove('searching');
	if (data1.docs.length === 0) {
		bookList.innerHTML = `No book found with this title`;
	} else {
		data1.docs.map((book, index) => {
			let bookId = book.key.split('/').pop();

			let ratingDiv = document.createElement('div');
			ratingDiv = 'ratingDiv';
			ratingDiv.id = `div${bookId}`;

			let rating = 0;
			data2.data.forEach((ratedBook) => {
				if (ratedBook.bookId == bookId) {
					rating = ratedBook.rating;
				}
			});

			let bookLi = document.createElement('li');

			let starsHTML = '';
			if (rating != 0) {
				for (let i = 1; i <= rating; i++) {
					starsHTML += `<span class="fa fa-star checked" id='${bookId}_${i}' onClick='rating(event)'></span>`;
				}

				for (let j = rating + 1; j <= 5; j++) {
					starsHTML += `<span class="fa fa-star" id='${bookId}_${j}' onClick='rating(event)'></span>`;
				}
			} else {
				for (let k = 1; k <= 5; k++) {
					starsHTML += `<span class="fa fa-star" id='${bookId}_${k}' onClick='rating(event)'></span>`;
				}
			}
			bookLi.innerHTML = `

			<h3 id=${bookId} onClick='addToList(event)' class='book-title'>${book.title}</h3>
			${starsHTML}

			<input type='hidden' id='rating' value=''/>
			<span class='chip-secondary' id=${bookId} onClick='submitRating(event)'>save</span>
			`;

			bookLi.classList.add('li-books');
			bookList.appendChild(bookLi);
		});
	}
});

function addToList(event) {
	console.log(event.target.id);
	console.log(event.target.innerHTML);

	let book = {
		id: event.target.id,
		title: event.target.innerHTML,
		read: false,
	};

	// check for existing local storage arrayof books here

	if (localStorage.getItem('myBooks')) {
		let existingList = JSON.parse(localStorage.getItem('myBooks'));
		let newBook = book;
		if (checkIfFound(book)) {
			alert('book already in the list');
			return false;
		}
		existingList.push(book);
		localStorage.setItem('myBooks', JSON.stringify(existingList));
	} else {
		let myBooks = [];
		let newBook = book;
		myBooks.push(newBook);

		localStorage.setItem('myBooks', JSON.stringify(myBooks));
	}

	let latestBookList = JSON.parse(localStorage.getItem('myBooks'));
	showList(latestBookList);
}

function checkIfFound(book) {
	let existingList = JSON.parse(localStorage.getItem('myBooks'));
	// Check if a value exists in the fruits array
	let title = book.title;
	const found = existingList.some((book) => book.title === title);
	if (found) {
		return true;
	} else {
		return false;
	}
}

function showList(books) {
	let ul = document.querySelector('.my-books-list');

	ul.innerHTML = '';
	let index = books.length - 1;
	while (index != -1) {
		let li = document.createElement('li');

		if (books[index].read === false) {
			li.innerHTML = `
            <h4 class='my-book' ondblclick='removeMe(event)' id=${books[index].id}>${books[index].title}</h4>
            <button id=${books[index].id} onclick='removeMe(event)' class='btn-primary'>Delete</button>
            <button id=${books[index].id} onclick='read(event)' class='btn-primary'>Read</button>
            <button id=${books[index].id} onclick='wish(event)' class='btn-primary'>Wish</button>
            `;

			li.classList.add('mybooks-list');
			ul.appendChild(li);
		}

		index--;
	}
}

function removeMe(event) {
	let currentBooks = JSON.parse(localStorage.getItem('myBooks'));

	let filteredBooks = currentBooks.filter((book) => {
		return book.id != event.target.id;
	});

	localStorage.setItem('myBooks', JSON.stringify(filteredBooks));
	showList(filteredBooks);
	showReadBooks(filteredBooks);
	showWishBooks(filteredBooks);
}

function read(event) {
	let currentBooks = JSON.parse(localStorage.getItem('myBooks'));

	// finding index

	index = currentBooks.findIndex((book) => book.id == event.target.id);
	// do here
	currentBooks[index].read = true;
	localStorage.setItem('myBooks', JSON.stringify(currentBooks));

	showReadBooks(currentBooks);
	showList(currentBooks);
}

function showReadBooks(readBooks) {
	let readBooksList = document.querySelector('.read-books-list');
	readBooksList.innerHTML = '';
	readBooks.map((book) => {
		if (book.read === true) {
			let li = document.createElement('li');

			li.innerHTML = `<h3 class='read-book' ondblclick='removeMe(event)' id=${book.id}>${book.title}</h3>`;

			li.classList.add('books-read-list');

			readBooksList.appendChild(li);
		}
	});
}

function wish(event) {
	let currentBooks = JSON.parse(localStorage.getItem('myBooks'));

	// finding index

	index = currentBooks.findIndex((book) => book.id == event.target.id);
	// do here
	currentBooks[index].wish = true;
	localStorage.setItem('myBooks', JSON.stringify(currentBooks));

	showWishBooks(currentBooks);
	showList(currentBooks);
	removeMe(currentBooks);
}

function showWishBooks(wishBooks) {
	let wishBooksList = document.querySelector('.wish-books-list');
	wishBooksList.innerHTML = '';
	wishBooks.map((book) => {
		if (book.wish === true) {
			let li = document.createElement('li');

			li.innerHTML = `<h3 class='my-book' ondblclick='removeMe(event)' id=${book.id}>${book.title}</h3>`;

			li.classList.add('books-wish-list');

			wishBooksList.appendChild(li);
		}
	});
}

// star adding

// function startRating() {
// 	const allStarts = document.querySelectorAll('.fa-star');

// 	console.log(allStarts.length);

// 	allStarts.forEach((star) => {
// 		star.addEventListener('mouseover', (event) => {
// 			event.target.classList.toggle('checked');
// 			const allPrevious = $(event.target).prevAll();

// 			$(event.target)
// 				.prevAll()
// 				.each(function (index, star) {
// 					console.log(star);
// 					if (star.classList.contains('checked')) {
// 						star.classList.remove('checked');
// 					} else {
// 						star.classList.add('checked');
// 					}
// 				});

// 			console.log(allPrevious);
// 			const id = event.target.id;
// 			$('#' + id)
// 				.prevAll()
// 				.css('background-color', 'red');
// 		});
// 	});
// }

function rating(event) {
	const idStr = event.target.id;

	let idParts = idStr.split('_');

	let index = parseInt(idParts[1]);

	let rating = document.querySelector('#rating');

	// check or uncheck

	if (event.target.classList.contains('checked')) {
		for (let i = index + 1; i <= 5; i++) {
			document
				.querySelector('#' + idParts[0] + '_' + i)
				.classList.remove('checked');
		}
	} else {
		for (let i = 1; i <= index; i++) {
			document
				.querySelector('#' + idParts[0] + '_' + i)
				.classList.add('checked');
		}
	}
	rating.value = index;
}

function submitRating(event) {
	// console.log();

	const rating = document.querySelector('#rating');

	console.log(rating.value);

	fetch(
		'http://localhost:5000/api/v1/rating?rating=' +
			rating.value +
			'&bookId=' +
			event.target.id,
		{
			headers: {
				Accept: 'application/json',
			},
			method: 'POST',
		}
	)
		.then((respone) => {
			respone.json();
		})
		.then((data) => {
			console.log(data);
		});
}
