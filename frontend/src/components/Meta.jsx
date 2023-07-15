import {Helmet} from 'react-helmet-async';



const Meta = ({title, description, keywords}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta nmae="description" content={description}/>
            <meta name="keyword" content={keywords}/>
        </Helmet>
    )
}

Meta.defaultProps ={
    title: "Bienvenue chez FASHION+",
    description: "De la mode pas cher",
    keywords: "L'élégance à petit prix"
}
export default Meta