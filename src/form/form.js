import { async } from "regenerator-runtime";
import "../assets/styles/styles.scss";
import "./form.scss";

console.log("form.js");

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const btnCancel = document.querySelector(".btn-secondary");
let articleId;
let errors = [];

const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");
  author.value = article.Item.author || "";
  img.value = article.Item.img || "";
  category.value = article.Item.category || "";
  title.value = article.Item.title || "";
  content.value = article.Item.content || "";
};

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");
  console.log("articleId: ", articleId);

  if (articleId) {
    const response = await fetch(
      `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev/article?id=${articleId}`
    );
    if (response.status < 300) {
      const article = await response.json();
      console.log("article", article);
      fillForm(article);
    }
  }
};

initForm();

btnCancel.addEventListener("click", () => {
  location.assign("/index.html");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const article = Object.fromEntries(formData.entries());
  try {
    if (formIsValid(article)) {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch(
          `https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev/article?id=${articleId}`,
          {
            method: "PATCH",
            body: json,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await fetch(
          "https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev",
          {
            method: "POST",
            body: json,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      if (response.status < 299) {
        location.assign("/index.html");
      }
    }
  } catch (e) {
    console.error("e: ", e);
  }
});

const formIsValid = (article) => {
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.img ||
    !article.title
  ) {
    errors.push("All fields must be filled!");
  }
  if (article.content.length < 20) {
    errors.push("Article too short!");
  }
  if (errors.length) {
    let errorHtml = "";
    errors.forEach((e) => {
      errorHtml += `<li>${e}<\li>`;
    });
    errorElement.innerHTML = errorHtml;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
