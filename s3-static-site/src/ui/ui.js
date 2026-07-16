function renderRecipeListItem(recipe) {
  return `
    <article class="recipe-card">
      <a class="recipe-card-link" href="detail.html?id=${recipe.id}">
        <strong>${recipe.name}</strong>
      </a>
    </article>
  `;
}

function highlightText(text, searchIngredients) {
  if (!searchIngredients || searchIngredients.length === 0) {
    return text;
  }

  const escaped = searchIngredients
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter(Boolean);

  if (escaped.length === 0) {
    return text;
  }

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  return String(text).replace(regex, `<span class="highlight-match">$1</span>`);
}

function renderRecipeSearchItem(recipe, searchIngredients) {
  return `
    <li class="search-result-item">
      <a href="detail.html?id=${recipe.id}">${highlightText(recipe.name, searchIngredients)}</a>
      <div class="search-result-ingredients">
        <strong>必要な材料と分量:</strong>
        <ul>
          ${recipe.ingredients
            .map(i => `<li>${highlightText(i.name, searchIngredients)} ${i.amount}</li>`)
            .join("\n")}
        </ul>
      </div>
    </li>
  `;
}

export function displayRecipeList(recipes) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = recipes.length
    ? `<div class="recipe-list">${recipes.map(renderRecipeListItem).join("\n")}</div>`
    : "<p>登録されたレシピがありません。</p>";
}

export function displayShortList(recipes, limit = 5) {
  const shortList = document.getElementById("shortList");
  if (!shortList) return;
  const items = recipes.slice(0, limit).map(r => `
    <div class="search-result-item">
      <a class="card-link" href="detail.html?id=${r.id}">
        <span>${r.name}</span>
        <small class="small-muted">${r.ingredients.length} 材料</small>
      </a>
    </div>
  `).join("\n");
  shortList.innerHTML = items || "<p class=\"small-muted\">登録されたレシピがありません。</p>";
}

export function displaySearchResults(recipes, searchIngredients) {
  const result = document.getElementById("result");
  result.innerHTML = recipes.length
    ? `<ul>${recipes.map(recipe => renderRecipeSearchItem(recipe, searchIngredients)).join("\n")}</ul>`
    : "<p>該当するレシピがありません。</p>";
}

export function clearSearchResults() {
  const result = document.getElementById("result");
  result.innerHTML = "";
}
