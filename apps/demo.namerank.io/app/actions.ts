"use server";

export async function analyzeNameRank(name: any): Promise<any> {
  if (!name) {
    throw new Error("Name is required");
  }

  const url = `https://izzkysqb6d6qzhnpv4ybqyty2e0ktjwe.lambda-url.us-east-1.on.aws/namerank/inspect-label/${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching name rank:", error);
    throw error;
  }
}
