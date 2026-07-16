import { useState } from "react";

function RegisterRecipeForm({ onRegister }) {
    const [recipeText, setRecipeText] = useState("");
    const [recipeUrl, setRecipeUrl] = useState("");

    const handleSubmit = () => {
        const registered = onRegister(recipeText, recipeUrl);
        if (registered) {
            setRecipeText("");
            setRecipeUrl("");
        }
    };

    const handleClear = () => {
        setRecipeText("");
        setRecipeUrl("");
    };

    return (
        <section className="register-panel">
            <label htmlFor="recipeText" className="field-label">
                整形済みレシピを貼り付け
            </label>
            <textarea
                id="recipeText"
                rows="12"
                value={recipeText}
                onChange={e => setRecipeText(e.target.value)}
                placeholder={`料理名\n材料\n- たまご 2個\n手順\n1. フライパンで炒める`}
            />

            <label htmlFor="recipeUrl" className="field-label">
                参考URL
            </label>
            <input
                id="recipeUrl"
                type="url"
                value={recipeUrl}
                onChange={e => setRecipeUrl(e.target.value)}
                placeholder="https://example.com"
            />

            <div className="button-row">
                <button type="button" onClick={handleSubmit}>
                    レシピ追加
                </button>
                <button type="button" className="secondary" onClick={handleClear}>
                    クリア
                </button>
            </div>

            <p className="hint">
                例: 料理名 / 材料 / 手順 / 参考URL の順に入力してください。
            </p>
        </section>
    );
}

export default RegisterRecipeForm;
