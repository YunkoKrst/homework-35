
const commentsContainer = document.getElementById("commentsContainer");
const commentsList = document.getElementById("commentsList");
const commentsLoader = document.getElementById("commentsLoader");

let commentPage = 1;  // Сторінка коментарів, яку зараз завантажуємо
const commentsPerPage = 10;  // Кількість коментарів на сторінку
let isLoading = false;  // Прапор, щоб уникнути повторних запитів під час завантаження
let allCommentsLoaded = false;  // Прапор, який показує, що всі коментарі завантажені

// Функція для створення HTML шаблону коментаря
const createCommentTemplate = (comment) => `
  <li style="padding: 10px; border-bottom: 1px solid #ccc;">
    <p><strong>${comment.name}</strong> (${comment.email})</p>
    <p>${comment.body}</p>
  </li>
`;

// Функція для завантаження коментарів
function loadComments() {
  if (isLoading || allCommentsLoaded) return;  // Якщо вже завантажується або всі коментарі завантажені, нічого не робимо
  isLoading = true;
  commentsLoader.classList.remove("hidden");  // Показати індикатор завантаження

  // Виклик API для завантаження коментарів
  fetch(`https://jsonplaceholder.typicode.com/comments?_page=${commentPage}&_limit=${commentsPerPage}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }
      return response.json();
    })
    .then(comments => {
      if (comments.length === 0) {
        allCommentsLoaded = true;  // Якщо коментарів більше немає, встановлюємо прапор
      } else {
        // Додати нові коментарі у список
        comments.forEach(comment => {
          commentsList.innerHTML += createCommentTemplate(comment);
        });
        commentPage++;  // Збільшити номер сторінки для наступного завантаження
      }
      isLoading = false;
      commentsLoader.classList.add("hidden");  // Приховати індикатор завантаження
    })
    .catch(() => {
      isLoading = false;
      commentsLoader.classList.add("hidden");  // У разі помилки приховати індикатор
    });
}

// Функція для перевірки, чи потрібно завантажувати нові коментарі
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = commentsContainer;
  if (scrollTop + clientHeight >= scrollHeight - 5) {  // Трохи зміщення для точнішої перевірки
    loadComments();  // Якщо скрол дійшов до кінця, завантажити нові коментарі
  }
}

// Додавання debounce для події скролу, щоб уникнути зайвих викликів
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Додати слухач для події скролу
commentsContainer.addEventListener("scroll", debounce(handleScroll, 100));

// Початкове завантаження коментарів
loadComments();