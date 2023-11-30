import { getImages } from './pixabay-api';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

let currentPage = 1;
let inputValue = '';

let lightbox = new SimpleLightbox('.photo-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

refs.searchForm.addEventListener('submit', handlerForm);
refs.loadMoreButton.addEventListener('click', fetchMoreImages);

async function handlerForm(event) {
  event.preventDefault();
  currentPage = 1;
  refs.galleryList.innerHTML = '';
  inputValue = event.currentTarget.elements.searchQuery.value.trim();

  if (!inputValue) {
    Notiflix.Notify.warning(
      'Please enter your search query before clicking the search button'
    );
    return;
  }

  fetchImages();
}

async function fetchImages() {
  try {
    const data = await getImages(inputValue, currentPage);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    addImagesToGallery(data);
    lightbox.refresh();
    toggleLoadMoreButton(data.totalHits > currentPage * 40);
  } catch (error) {
    console.error(error);
  }
}

async function fetchMoreImages() {
  currentPage += 1;
  fetchImages();
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
            <a class="photo-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                    </p>
                </div>
            </a>
        </div>
    `
    )
    .join('');
}

function addImagesToGallery(data) {
  refs.galleryList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
}

function toggleLoadMoreButton(show) {
  refs.loadMoreButton.style.display = show ? 'block' : 'none';
}

Notiflix.Notify.init({ fontSize: '15px' });
