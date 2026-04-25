const { search } = require('duck-duck-scrape');

async function test() {
    try {
        console.log("Testing DDG...");
        const res = await search('fideicomiso', { region: 'es-es', safeSearch: 0 });
        console.log("DDG results:", res.results.length);
    } catch (e) {
        console.error("DDG ERROR:", e.message);
    }

    try {
        console.log("Testing Tavily...");
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: "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",
                query: "fideicomiso",
                search_depth: "advanced",
                max_results: 5
            })
        });
        const data = await response.json();
        if (data.results) {
            console.log("Tavily results:", data.results.length);
        } else {
            console.log("Tavily error:", data);
        }
    } catch (e) {
        console.error("Tavily exception:", e.message);
    }
}
test();
