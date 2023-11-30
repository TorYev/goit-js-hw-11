import axios from 'axios';
import Notiflix from 'notiflix';

export async function getImages(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40997598-50b128a6bfeaf6dfaef76deb6';

  Notiflix.Loading.standard();
  try {
    const params = new URLSearchParams({
      q: name,
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    });

    const response = await axios.get(`${BASE_URL}?${params}`);
    Notiflix.Loading.remove();
    return response.data;
  } catch (error) {
    Notiflix.Loading.remove();
    throw error;
  }
}
