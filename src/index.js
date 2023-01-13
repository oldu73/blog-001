import { async } from "regenerator-runtime";
import "./assets/styles/styles.scss";
import "./index.scss";
import { openModal } from "./assets/javascripts/modal";

console.log("index.js");

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles;
let sortBy = "desc";

selectElement.addEventListener("change", () => {
  sortBy = selectElement.value;
  fetchArticle();
});

const createArticles = () => {
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((article) => {
      const articleDOM = document.createElement("div");
      articleDOM.classList.add("article");
      articleDOM.innerHTML = `
<img
  src="${article.img}"
  alt="profile"
/>
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${new Date(
        article.createdAt
      ).toLocaleDateString("fr-CH", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}</p>
<p class="article-content">
  ${article.content}
</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article.id} >Delete</button>
  <button class="btn btn-primary" data-id=${article.id} >Edit</button>
</div>
`;
      return articleDOM;
    });
  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  const editButtons = articleContainerElement.querySelectorAll(".btn-primary");
  editButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const target = event.target;
      const articleId = target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      openModal("Are you sure you want to delete your article?");
      // if (result === true) {
      //   try {
      //     const target = event.target;
      //     const articleId = target.dataset.id;
      //     const articleToDelete = new Object();
      //     articleToDelete.id = articleId;
      //     const json = JSON.stringify(articleToDelete);
      //     const response = await fetch(
      //       `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev`,
      //       {
      //         method: "DELETE",
      //         body: json,
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );
      //     const body = await response.json();
      //     fetchArticle();
      //   } catch (e) {
      //     console.log("e: ", e);
      //   }
      // }
    });
  });
};

const displayMenuCategories = (categoriesArr) => {
  const liElements = categoriesArr.map((categoryElem) => {
    const li = document.createElement("li");
    li.innerHTML = `${categoryElem[0]} ( <strong>${categoryElem[1]}</strong> )`;
    if (categoryElem[0] === filter) {
      li.classList.add("active");
    }
    li.addEventListener("click", () => {
      if (filter === categoryElem[0]) {
        filter = null;
        li.classList.remove("active");
      } else {
        filter = categoryElem[0];
        liElements.forEach((li) => {
          li.classList.remove("active");
        });
        li.classList.add("active");
      }
      createArticles();
    });
    return li;
  });
  categoriesContainerElement.innerHTML = "";
  categoriesContainerElement.append(...liElements);
};

const createMenuCategories = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort();
  displayMenuCategories(categoriesArr);
};

const fetchArticle = async () => {
  try {
    const response = await fetch(
      `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev/articles/${sortBy}/`,
      {
        method: "GET",
      }
    );
    let content = await response.json();
    // articles = content.body.Items;
    articles = content.body;
    // Standard api behavior return not an array if only one element
    // so below code convert it (one element) into an array
    // otherwise it cause an error when 'map' method (to create articles) will be called on it.
    if (!Array.isArray(articles)) {
      articles = [articles];
    }
    createArticles();
    createMenuCategories();
  } catch (e) {
    console.log("e : ", e);
  }
};

fetchArticle();
