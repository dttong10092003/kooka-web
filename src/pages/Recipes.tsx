import { useState } from "react"
import HeroKeywordSearch from "../components/HeroKeywordSearch"
import SearchingRecipes from "../components/SearchingRecipes"

const Recipes = () => {
    const [searchParams, setSearchParams] = useState<{
        keyword: string
        cuisine?: string
        category?: string
        tags?: string[]
    }>({
        keyword: "",
    })

    return (
        <>
            <HeroKeywordSearch onSearchKeyword={(params) => setSearchParams(params)} />
            <SearchingRecipes searchParams={searchParams} />
        </>
    )
}

export default Recipes
