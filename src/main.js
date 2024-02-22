import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
  formEl: document.querySelector('.js-search-form'),
  infoEl: document.querySelector('.js-list-img'),
  loaderEl: document.querySelector('.loader'),
};

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  

  refs.infoEl.innerHTML = '';
  
  
  refs.loaderEl.classList.add('show');

  const userQuery = e.target.elements.query.value;
  if (!userQuery) {
    iziToast.warning({
      position: 'topRight',
      message: 'Please enter a search query.',
    });
    
    
    refs.loaderEl.classList.remove('show');
    return;
  }

  getImage(userQuery)
    .then(data => {
    
      refs.loaderEl.classList.remove('show');

      if (data.hits.length === 0) {
        iziToast.error({
          position: 'topRight',
          messageSize: '50',
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        renderGallery(data);
        e.target.elements.query.value = '';
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      iziToast.error({
        position: 'topRight',
        messageSize: '50',
        message: 'Failed to fetch images. Please try again later.',
      });
      
      refs.loaderEl.classList.remove('show');
    });
}

function getImage(nameImage) {
  const BASE_URL = 'https://pixabay.com/';
  const END_POINT = '/api/';
  const PARAMS = `?key=42187150-1e170edc08d41224404163b7f&q=${nameImage}&image_type=photo&orientation=horizontal&safesearch=true`;

  const url = BASE_URL + END_POINT + PARAMS;

  return fetch(url).then(res => res.json());
}

function imageTemplate(nameImage) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = nameImage;
  return `<div class="image js-image">
    <div class="image-container">
      <a class="gallery-link" href="${largeImageURL}">
        <img
          src="${webformatURL}"
          alt="${tags}"
          class="image js-image"
        />
      </a>
    </div>
    <div class="image-body">
      <ul class="info">
        <li class="info-item">
          <b class="info-item-title">Likes</b>
          <span class="info-item-value">${likes}</span>
        </li>
        <li class="info-item">
          <b class="info-item-title">Views</b>
          <span class="info-item-value">${views}</span>
        </li>
        <li class="info-item">
          <b class="info-item-title">Comments</b>
          <span class="info-item-value">${comments}</span>
        </li>
        <li class="info-item">
          <b class="info-item-title">Downloads</b>
          <span class="info-item-value">${downloads}</span>
        </li>
      </ul>
    </div>
  </div>`;
}

function renderGallery({ hits }) {
  const markup = hits.map(imageTemplate).join('');
  refs.infoEl.insertAdjacentHTML('beforeend', markup);
  
 
  const lightbox = new SimpleLightbox('.gallery-link', {
    captionDelay: 250,
    captionsData: 'alt',
  });
  lightbox.refresh();
}