const USE_MOCK = true
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function generateReview(
  persona: any,
  restaurant: string,
  description: string
) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 3200)) // simulate API delay
    return {
      rating: 3.8,
      review: `This place ehn — ${restaurant} get potential but e never reach full marks. The ${
        description.toLowerCase().includes("jollof") ? "jollof rice" : "food"
      } was decent, smoky the way I like am, but the service was slow like NEPA restoring light. 
I waited almost 25 minutes before anybody acknowledged my table. The ambience sha was cool — 
good for a chill outing. For the price? E dey manageable. I go try am one more time before I 
give final verdict, but right now — 3.8 stars. They need to do better on the customer service side.`,
      persona_name: persona?.name ?? "Anonymous",
      naija_mode: persona?.naijaMode ?? false,
    }
  }

  const res = await fetch(`${BASE_URL}/generate-review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona, restaurant, description }),
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Failed to generate review")
  return res.json()
}

export async function getRecommendations(persona: any) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2500))
    return {
      recommendations: [
        {
          name: "Buka Hut Lagos",
          category: "Local Nigerian",
          reason: "You love smoky jollof and local vibes — this place is rated #1 for it",
          predicted_rating: 4.5,
          match_pct: 94,
        },
        {
          name: "Suya Spot Abuja",
          category: "Street Food",
          reason: "Matches your love for spicy, grilled meat",
          predicted_rating: 4.2,
          match_pct: 88,
        },
        {
          name: "Yellow Chilli",
          category: "Nigerian Fine Dining",
          reason: "Popular with food lovers who rate quality highly",
          predicted_rating: 4.0,
          match_pct: 79,
        },
        {
          name: "Mama Cass",
          category: "Local Nigerian",
          reason: "Budget-friendly, authentic Nigerian — perfect for your vibe",
          predicted_rating: 3.9,
          match_pct: 74,
        },
        {
          name: "Nkoyo",
          category: "Modern Nigerian",
          reason: "Elevated Nigerian cuisine — suits your appreciation for quality",
          predicted_rating: 4.3,
          match_pct: 82,
        },
        {
          name: "Jevenik",
          category: "Local Nigerian",
          reason: "Fan favourite for local soups — right up your alley",
          predicted_rating: 4.1,
          match_pct: 77,
        },
      ],
    }
  }

  const res = await fetch(`${BASE_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona }),
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Failed to get recommendations")
  return res.json()
}