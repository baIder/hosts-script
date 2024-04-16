export const handleText = (str: string) => {
    const rows = str
        .split("\n")
        .filter((row) => row.length > 0)
        .filter((row) => !row.startsWith("#"))
        .map((row) => row.split(/\t|\s+/));
    console.log(rows);
    return rows;
};
