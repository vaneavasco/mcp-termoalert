import fetch from "node-fetch";

/**
 * Fetches the HTML content of the issues page.
 * @param url - The URL to fetch the issues page from.
 * @returns A promise resolving to the HTML content as a string.
 * @throws Error if the fetch fails or returns non-OK status.
 */
export async function fetchIssuesPage(url: string): Promise<string> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "text/html",
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch issues page. HTTP status: ${response.status} ${response.statusText}`,
        );
    }

    return response.text();
}
