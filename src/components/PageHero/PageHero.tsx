import { useWindowSize } from '@react-hookz/web'

interface PageHeroProps {
    image: string
}

const PageHero = ({ image }: PageHeroProps) => {
    const { width } = useWindowSize()

    return (
        <div
            className="bg-pzh-blue-500 hidden h-[288px] w-full bg-cover bg-center bg-no-repeat md:block"
            style={{
                backgroundImage: `url(${image})`,
                height: width > 1600 ? 288 : 240,
            }}
        />
    )
}

export default PageHero
