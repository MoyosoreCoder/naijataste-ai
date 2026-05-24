export type FoodVibe = | "pepper_lover" | "local_chop" | "harsh_rater" | "owambe_lover"

export type Persona = {
    name: string
    ageRange: string
    favoriteFoods: string[]
    vibe: FoodVibe
    location: string
    naijaMode: boolean  
}

export type Review ={
    rating: number
    review: string
    persona_name: string
    naija_mode: boolean
}

export type Recommendation = {
    name: string
    category: string
    reason: string
    predicted_rating: number
    match_pct: number
}