/* Nawaf MOhammed Ayyash Ibrahim - 2140924 */

document.addEventListener("DOMContentLoaded", function () {
  const repoForm = document.getElementById("repoForm");
  const usernameInput = document.getElementById("usernameInput");
  const repoList = document.getElementById("repoList");
  const errorMessage = document.getElementById("errorMessage");
  const clearButton = document.getElementById("clearButton");
  const sortOption = document.getElementById("sortOption");
  errorMessage.style.display = "none";

  repoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = usernameInput.value;
    getGitHubRepos(username);
  });

  sortOption.addEventListener("change", function () {
    sortRepos();
  });

  clearButton.addEventListener("click", function () {
    usernameInput.value = "";
    repoList.innerHTML = "";
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  });

  function getGitHubRepos(username) {
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `User not found or repositories not accessible! Please check the username and try again.`
          );
        }
        return response.json();
      })
      .then((data) => {
        displayRepos(data);
      })
      .catch((error) => {
        displayErrorMessage(error.message);
        errorMessage.style.display = "block";
      });
  }

  function displayRepos(data) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    let repos = data.map((repo) => {
      return {
        name: repo.name,
        description: repo.description || "No description available",
        language: repo.language || "Not specified",
        stars: repo.stargazers_count,
        updated: new Date(repo.updated_at),
        html_url: repo.html_url,
      };
    });

    const sortBy = sortOption.value;
    repos =
      sortBy === "name"
        ? repos.sort((a, b) => a.name.localeCompare(b.name))
        : sortBy === "stars"
        ? repos.sort((a, b) => b.stars - a.stars)
        : repos.sort((a, b) => b.updated - a.updated);

    const reposHTML = repos
      .map(
        (repo) => `
              <div class="repo-item">
              <h3><a href="${repo.html_url}" target="_blank">${
          repo.name
        }</a></h3>

                  <p>${repo.description}</p>
                  <p>Language: ${repo.language}</p>
                  <p>Stars: ${repo.stars}</p>
                  <p>Last Updated: ${formatDate(repo.updated)}</p>
              </div>
          `
      )
      .join("");

    repoList.innerHTML = reposHTML;
  }

  function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  function displayErrorMessage(message) {
    repoList.innerHTML = "";
    errorMessage.textContent = message;
  }

  function sortRepos() {
    const username = usernameInput.value;
    if (username) {
      getGitHubRepos(username);
    }
  }
});
