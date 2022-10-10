import { async } from "regenerator-runtime";
import "./assets/styles/styles.scss";
import "./index.scss";

console.log("index.js");

const articleContainerElement = document.querySelector(".articles-container");

const createArticles = (articles) => {
  const articlesDOM = articles.map((article) => {
    const articleDOM = document.createElement("div");
    articleDOM.classList.add("article");
    articleDOM.innerHTML = `
<img
  src="${article.img}"
  alt="profile"
/>
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${article.category}</p>
<p class="article-content">
  ${article.content}
</p>
<div class="article-actions">
  <button class="btn btn-delete" data-id=${article.id} >Delete</button>
</div>
`;
    return articleDOM;
  });
  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-delete");
  console.log(deleteButtons);
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const target = event.target;
        const articleId = target.dataset.id;
        const articleToDelete = new Object();
        articleToDelete.id = articleId;
        const json = JSON.stringify(articleToDelete);
        console.log(json);
        const response = await fetch(
          `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev`,
          {
            method: "DELETE",
            body: json,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const body = await response.json();
        console.log(body);
        fetchArticle();
      } catch (e) {
        console.log("e: ", e);
      }
    });
  });
};

const fetchArticle = async () => {
  try {
    const response = await fetch(
      `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev`,
      {
        method: "GET",
      }
    );
    let content = await response.json();
    let articles = content.body.Items;
    console.log(articles);
    // Standard api behavior return not an array if only one element
    // so below code convert it (one element) into an array
    // otherwise it cause an error when 'map' method (to create articles) will be called on it.
    if (!Array.isArray(articles)) {
      articles = [articles];
    }
    createArticles(articles);
  } catch (e) {
    console.log("e : ", e);
  }
};

fetchArticle();
