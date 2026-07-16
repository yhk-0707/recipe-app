import { initializeRecipes, getRecipeById, updateRecipe, deleteRecipe, addRecipe } from "./data/recipes.js";
import { createConfirmModal } from "./ui/modal.js";
import { showToast } from "./ui/toast.js";

function getRecipeIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function formatIngredientsTextarea(ingredients) {
  return ingredients.map(item => `${item.name}|${item.amount}`).join("\n");
}

function parseIngredientsTextarea(text) {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .map(line => {
      const [name, amount] = line.split("|").map(part => part.trim());
      return {
        name: name || "",
        amount: amount || ""
      };
    });
}

function parseStepsTextarea(text) {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");
}

function renderRecipeDetail(recipe) {
  const detail = document.getElementById("detail");
  if (!recipe) {
    detail.innerHTML = `<p>指定されたレシピが見つかりませんでした。</p>`;
    return;
  }

  detail.innerHTML = `
    <article class="recipe-detail">
      <div class="detail-header">
        <div>
          <h2>${recipe.name}</h2>
        </div>
      </div>
      ${recipe.url ? `<section class="detail-section">
        <h3>参考URL</h3>
        <p><a href="${recipe.url}" target="_blank" rel="noopener noreferrer">${recipe.url}</a></p>
      </section>` : ""}
      <section class="detail-section">
        <h3>材料</h3>
        <ul>
          ${recipe.ingredients.map(i => `<li>${i.name} ${i.amount}</li>`).join("\n")}
        </ul>
      </section>
      <section class="detail-section">
        <h3>手順</h3>
        <ol>
          ${recipe.steps.map(step => `<li>${step}</li>`).join("\n")}
        </ol>
      </section>
    </article>
    <div class="detail-toolbar">
      <div class="detail-toolbar-links">
        <a class="button-link secondary" href="recipes.html">一覧に戻る</a>
        <a class="button-link secondary" href="index.html">トップに戻る</a>
      </div>
      <div class="detail-actions detail-actions-main">
        <button id="editButton" type="button">編集する</button>
        <button id="deleteButton" type="button">削除</button>
      </div>
    </div>
    <div id="editMode" class="recipe-edit" style="display:none; margin-top:24px;">
      <h2>レシピを編集</h2>
      <label>
        料理名<br>
        <input type="text" id="editName" value="${recipe.name}" />
      </label>
      <label>
        材料（1行につき name|amount）<br>
        <textarea id="editIngredients" rows="6">${formatIngredientsTextarea(recipe.ingredients)}</textarea>
      </label>
      <label>
        手順（1行につき1つ）<br>
        <textarea id="editSteps" rows="6">${recipe.steps.join("\n")}</textarea>
      </label>
      <label>
        参考URL<br>
        <input type="url" id="editUrl" value="${recipe.url}" />
      </label>
      <div class="detail-actions detail-actions-main" style="margin-top:12px;">
        <button id="saveButton" type="button">保存</button>
        <button id="cancelButton" type="button">キャンセル</button>
      </div>
    </div>
  `;
}

function toggleEditMode(show) {
  const editMode = document.getElementById("editMode");
  if (editMode) {
    editMode.style.display = show ? "block" : "none";
  }
}

async function deleteCurrentRecipe(recipeId, recipeName, modal) {
  const confirmed = await modal.show(`「${recipeName}」を削除してもよろしいですか？`);
  if (!confirmed) return;

  const recipeObj = getRecipeById(recipeId);
  if (!recipeObj) return;

  deleteRecipe(recipeId);
  showToast(`「${recipeName}」を削除しました`, {
    timeout: 5000,
    undo: () => {
      addRecipe(recipeObj);
      window.location.href = `detail.html?id=${recipeId}`;
    }
  });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 300);
}

function bindDetailControls(recipeId, recipeName) {
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");
  const deleteButton = document.getElementById("deleteButton");

  if (editButton) {
    editButton.addEventListener("click", () => toggleEditMode(true));
  }
  if (cancelButton) {
    cancelButton.addEventListener("click", () => toggleEditMode(false));
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const name = document.getElementById("editName").value.trim();
      const ingredients = parseIngredientsTextarea(document.getElementById("editIngredients").value);
      const url = document.getElementById("editUrl").value.trim();
      const steps = parseStepsTextarea(document.getElementById("editSteps").value);

      if (!name) {
        alert("料理名を入力してください。\n");
        return;
      }

      if (ingredients.length === 0) {
        alert("材料を1つ以上入力してください。\n");
        return;
      }

      updateRecipe(recipeId, { name, ingredients, steps, url });
      const updatedRecipe = getRecipeById(recipeId);
      renderRecipeDetail(updatedRecipe);
      bindDetailControls(recipeId, updatedRecipe.name);
      toggleEditMode(false);
      alert("レシピを更新しました");
    });
  }

  const modal = createConfirmModal();
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentRecipe(recipeId, recipeName, modal);
    });
  }
  window.addEventListener('beforeunload', () => modal.destroy());
}

function initializeDetailPage() {
  initializeRecipes();
  const recipeId = getRecipeIdFromQuery();
  const recipe = getRecipeById(recipeId);
  renderRecipeDetail(recipe);

  if (recipe) {
    bindDetailControls(recipeId, recipe.name);
  }
}

initializeDetailPage();
