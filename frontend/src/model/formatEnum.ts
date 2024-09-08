export function formatEnum(enumString: string): string {
    if (!enumString) return ""; // Проверяем, чтобы строка была не пустой

    return enumString.split('_')
        .map(letter => letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase())
        .join(enumString !== "NON_FICTION" ? " " : "-");
}