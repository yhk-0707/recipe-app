function SearchBox({ query, onChange }) {
    // 検索欄のコンポーネント化
    // value,checkedのpropsで現在のstateを渡す場合は、渡された値を更新するonChangeハンドラも渡す。
    return (
        <input
            value={query} // 入力欄の値をqueryにバインドする。文字列props
            onChange={e => onChange(e.target.value)} // 入力欄の値が変更されたときにqueryを更新する。
            placeholder="材料または料理名" // 入力欄のプレースホルダーを設定する
        />
    );
}

export default SearchBox;
