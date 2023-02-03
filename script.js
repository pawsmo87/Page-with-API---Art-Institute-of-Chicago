const content = document.querySelector('.content')
const main = document.querySelector('main')
const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const input = document.querySelector('.input')
const iiif_url = 'https://www.artic.edu/iiif/2/' //baza url
const size = '/full/843,/0/default.jpg' // wielkość obrazu
const imgArray = []
const inputImg = document.querySelector('.inputImg')
const errorOne = document.querySelector('.error-info-one')
const errorTwo = document.querySelector('.error-info-two')
let pgNr = input.value
const searchInput = document.querySelector('.searchInput')
const searchBtn = document.querySelector('.search-btn')
let totalPage = document.querySelector('.totalPage')
let total = document.querySelector('.total')
const go = document.querySelector('.go')

const newPic = () => {
	if (inputImg.value > 10 || inputImg.value < 1) {
		errorTwo.textContent = 'wybierz ilość od 1-10'
	} else {
		errorTwo.textContent = ''
		errorOne.textContent = ''
		axios
			.get('https://api.artic.edu/api/v1/artworks?page=' + pgNr + '&limit=' + inputImg.value)
			.then(res => {
				console.log(res)
				for (let i = 0; i < inputImg.value; i++) {
					let liItem = document.createElement('li') // tworzy li
					const a = document.createElement('a') // tworzy a
					a.setAttribute('href', iiif_url + res.data.data[i].image_id + size)
					a.setAttribute('target', '_blank')
					let img = document.createElement('img') // tworzy img
					const title = document.createElement('h2') // tworzy h2
					const artist = document.createElement('p') // tworzy p
					img.setAttribute('src', iiif_url + res.data.data[i].image_id + size) // daodaje src do img
					artist.innerHTML = res.data.data[i].artist_title // dodaje autora do h2
					title.innerHTML = `"${res.data.data[i].title}"` // dodaje tytuł do p
					imgArray.push(img) // wysyła img do tablicy
					liItem.appendChild(title) // dodaje tytuł do li
					liItem.appendChild(artist) // dodaje autora do li
					a.appendChild(img) // dodaje img do a
					liItem.appendChild(a) // dodaje a do li
					content.appendChild(liItem) // dodaje li do kontenera
					totalPage.innerHTML = res.data.pagination.total_pages
					total.innerHTML = res.data.pagination.total
				}
			})
			.catch(error => {
				const img = document.createElement('img')
				const li = document.createElement('li')
				imgLink = 'https://cdn.pixabay.com/photo/2015/03/14/19/45/suit-673697__340.jpg'
				img.setAttribute('src', imgLink)
				const errorMessage = document.createElement('p')
				errorMessage.innerHTML = 'Nie udało się załadować obrazka'
				li.appendChild(errorMessage)
				li.appendChild(img)
				content.appendChild(li)
			})
	}
}

newPic()

// funkcja prev

const prev = () => {
	if (searchInput.value === '') {
		errorOne.textContent = ''
		if (pgNr > 1) {
			input.value--
			pgNr = input.value
			while (content.firstChild) {
				content.removeChild(content.firstChild)
			}
			newPic()
		} else {
			errorOne.textContent = 'strona nie może być mniejsza niż jeden'
		}
	} else {
		errorOne.textContent = ''
		if (pgNr > 1) {
			input.value--
			pgNr = input.value
			while (content.firstChild) {
				content.removeChild(content.firstChild)
			}
			search()
		} else {
			errorOne.textContent = 'strona nie może być mniejsza niż jeden'
		}
	}
}

// funkcja next

const next = () => {
	if (searchInput.value === '') {
		console.log(`pgnr to   ${pgNr}  a total pages to  ${totalPage.innerHTML} `)
		if (pgNr < parseInt(totalPage.innerHTML)) {
			errorOne.textContent = input.value++
			pgNr = input.value
			while (content.firstChild) {
				content.removeChild(content.firstChild)
			}

			newPic()
		} else {
			errorOne.textContent = 'niema więcej stron'
		}
	} else {
		if (pgNr < parseInt(totalPage.innerHTML)) {
			errorOne.textContent = ''
			input.value++
			pgNr = input.value
			while (content.firstChild) {
				content.removeChild(content.firstChild)
			}
			search()
		} else {
			errorOne.textContent = 'niema więcej stron'
		}
	}
}

const search = () => {
	if (inputImg.value > 10 || inputImg.value < 1) {
		errorTwo.textContent = 'wybierz ilość od 1-10'
	} else {
		errorTwo.textContent = ''
		errorOne.textContent = ''

		while (content.firstChild) {
			content.removeChild(content.firstChild)
		}
		for (let i = 0; i < inputImg.value; i++) {
			axios
				.get(
					`https://api.artic.edu/api/v1/artworks/search?q=` +
						searchInput.value +
						'&limit=' +
						inputImg.value +
						'&page=' +
						pgNr
				)
				.then(res => {
					// console.log(res)
					const apiLink = res.data.data[i].api_link
					axios
						.get(apiLink)
						.then(res2 => {
							if (res2.data.data.image_id === null) {
								image_id = alt_image_id
							}
							console.log(res2.data.data.image_id)
							let liItem = document.createElement('li') // tworzy li
							const a = document.createElement('a') // tworzy a
							a.setAttribute('target', '_blank')
							a.setAttribute('href', iiif_url + res2.data.data.image_id + size)
							let img = document.createElement('img') // tworzy img

							img.setAttribute('src', iiif_url + res2.data.data.image_id + size)

							const title = document.createElement('h2')
							const artist = document.createElement('p')
							title.innerHTML = `"${res2.data.data.title}"`
							artist.innerHTML = res2.data.data.artist_title
							imgArray.push(img)
							liItem.appendChild(title)
							liItem.appendChild(artist)
							a.appendChild(img) // dodaje img do a
							liItem.appendChild(a) // dodaje a do li
							content.appendChild(liItem)
							totalPage.innerHTML = res.data.pagination.total_pages
							total.innerHTML = res.data.pagination.total
						})
						.catch(error => {
							const img = document.createElement('img')
							const li = document.createElement('li')
							imgLink = 'https://cdn.pixabay.com/photo/2015/03/14/19/45/suit-673697__340.jpg'
							img.setAttribute('src', imgLink)
							const errorMessage = document.createElement('p')
							errorMessage.innerHTML = 'Nie udało się załadować obrazka'
							li.appendChild(errorMessage)
							li.appendChild(img)
							content.appendChild(li)
						})
				})
				.catch(error => {
					const img = document.createElement('img')
					const li = document.createElement('li')
					imgLink = 'https://cdn.pixabay.com/photo/2015/03/14/19/45/suit-673697__340.jpg'
					img.setAttribute('src', imgLink)
					const errorMessage = document.createElement('p')
					errorMessage.innerHTML = 'Nie udało się załadować obrazka'
					li.appendChild(errorMessage)
					li.appendChild(img)
					content.appendChild(li)
				})
		}
	}
}

nextBtn.addEventListener('click', next)
prevBtn.addEventListener('click', prev)
searchBtn.addEventListener('click', function () {
	input.value = 1
	search()
})
searchInput.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		input.value = 1
		search()
	}
})
inputImg.addEventListener('keyup', function (e) {
	if (e.key === 'Enter') {
		while (content.firstChild) {
			content.removeChild(content.firstChild)
		}
		if (searchInput.value === '') {
			pgNr = input.value

			newPic()
		} else {
			pgNr = input.value

			search()
		}
	}
})
input.addEventListener('keyup', function (e) {
	if (e.key === 'Enter') {
		if (parseInt(input.value) <= parseInt(totalPage.innerHTML)) {
			while (content.firstChild) {
				content.removeChild(content.firstChild)
			}
			if (searchInput.value === '') {
				pgNr = input.value
				console.log('nie ma nic w search ' + pgNr)
				newPic()
			} else {
				pgNr = input.value

				search()
			}
		} else {
			errorOne.textContent = 'niema tak dużo stron'
		}
	}
})

go.addEventListener('click', () => {
	if (parseInt(input.value) <= parseInt(totalPage.innerHTML)) {
		while (content.firstChild) {
			content.removeChild(content.firstChild)
		}
		if (searchInput.value === '') {
			pgNr = input.value
			console.log('nie ma nic w search ' + pgNr)
			newPic()
		} else {
			pgNr = input.value

			search()
		}
	} else {
		errorOne.textContent = 'niema tak dużo stron'
	}
})

//kontenery z najczesciej wuszukiwanymi

// wrzucic na gita
// paginacja na gore?
// powiekszanie obrazow, lub nowe okno
// jesli jest tylko jeden wynik nie pokazuj reszty
