import "../assets/styles/styles.scss";
import "./form.scss";

console.log("form.js");

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
let errors = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const article = Object.fromEntries(formData.entries());
  try {
    if (formIsValid(article)) {
      const json = JSON.stringify(article);
      const response = await fetch(
        "https://chr562igwa.execute-api.eu-central-1.amazonaws.com/dev",
        {
          method: "POST",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const body = await response.json();
      console.log(body);
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
