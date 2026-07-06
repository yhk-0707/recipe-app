function SearchBox({ query, onChange }) {
    return (
        <input
            value={query}
            onChange={e => onChange(e.target.value)}
            placeholder="材料または料理名"
        />
    );
}

export default SearchBox;
