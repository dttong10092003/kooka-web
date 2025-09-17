import { useState } from "react"
import HeroSection from "../components/HeroSection";
import PopularRecipes from "../components/PopularRecipes";
import SearchingRecipes from "../components/SearchingRecipes"

const Home = () => {
    const [searchParams, setSearchParams] = useState<{
        ingredients: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    } | null>(null)

    return (
        <>
            <HeroSection onSearch={setSearchParams} />

            {/* Nếu đã tìm kiếm thì show SearchingRecipes, không thì show PopularRecipes */}
            {searchParams ? (
                <SearchingRecipes
                    ingredients={searchParams.ingredients}
                    cuisine={searchParams.cuisine}
                    category={searchParams.category}
                    tags={searchParams.tags}
                />
            ) : (
                <PopularRecipes />
            )}
        </>
    );
};

export default Home;