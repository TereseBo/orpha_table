// performs a request and resolves with JSON
export const fetchJson = async (url, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};

// get JSON from multiple URLs 
export const fetchAndSetAll = async (collection) => {
    // fetch all data first
    const allData = await Promise.all(
        collection.map(({ url, init }) => fetchJson(url, init))
    );

return allData;
};