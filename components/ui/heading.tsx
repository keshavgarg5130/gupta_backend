import React from "react";

interface HeadingProps {
    title: string;
    description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return(
        <div>
            <h2 className='text-4xl font-bold'>{title}</h2>
            <p>{description}</p>
        </div>
    )
}