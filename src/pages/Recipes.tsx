import { useState } from "react"
import CombinedRecipeSearch from "../components/CombinedRecipeSearch"
import SearchingRecipes from "../components/SearchingRecipes"
import PopularRecipes from "../components/PopularRecipes"

const Recipes = () => {
    const [searchParams, setSearchParams] = useState<{
        keyword?: string
        ingredients?: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    } | null>(null)

    const handleSearch = (params: {
        keyword?: string
        ingredients?: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    } | null) => {
        setSearchParams(params)
    }

    return (
        <>
            <CombinedRecipeSearch onSearch={handleSearch} />

            {searchParams ? (
                <SearchingRecipes
                    searchParams={searchParams.keyword ? searchParams : undefined}
                    ingredients={searchParams.ingredients}
                    cuisine={searchParams.cuisine}
                    category={searchParams.category}
                    tags={searchParams.tags}
                />
            ) : (
                <PopularRecipes />
            )}
        </>
    )
}

export default Recipes
