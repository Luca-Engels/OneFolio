"use client"
import React, { useRef } from 'react'


type Props = {
    title: string,
    date: string,
    details: {}
    
}


const InvestmentCard = ({data:props}:{data:Props}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    
    //TODO expand button height to h-96 if button is pressed
    
    const onClickExpand = () => {
        if(gridRef.current){
            if(gridRef.current.classList.toggle("expanded")){
                gridRef.current.querySelectorAll(':nth-child(n+4):not(:last-child)').forEach((node) => {
                    node.classList.remove('hidden');
                });
            }
            else{
                gridRef.current.querySelectorAll(':nth-child(n+4):not(:last-child)').forEach((node) => {
                    node.classList.add('hidden');
                });
            }
        }
    }
    
    console.log("PROPS:" ,props.details)

return (
    <div className={"btn-nav rounded-md flex xl:flex-row flex-col xl:gap-8 px-4 group h-full"}>
        <button onClick={onClickExpand} className={"flex xl:flex-col flex-row justify-between xl:w-1/2 w-full items-end text-right h-full gap-4"}>
            <h1 className={"pt-8 text-accentLight dark:text-accentDark xl:text-5xl md:text-2xl text-xl font-semibold pb-8 group-hover:text-accentTextLight group-focus:text-accentTextLight dark:group-hover:text-accentTextDark dark:group-focus:text-accentTextDark"}>
                {props.title}
            </h1>
                {props.date&&
                <div className='pb-8'>
                    <p className={"xl:text-sm text-xs font-light"}>Erstellt:</p>
                    <p className={"xl:text-2xl text-lg font-normal"}>{props.date}</p>
                </div>
                }
        </button>
        <div className='xl:py-4 h-full'>
            <div
                className={"border-r-2 h-full border-accentLight dark:border-accentDark group-hover:border-accentBorderLight group-focus:border-accentBorderLight dark:group-hover:border-accentBorderDark dark:group-focus:border-accentBorderDark"}
            />
        </div>
        <div className='p-8 h-full xl:w-1/2 w-full'>
            <div className={"grid gap-4  items-center text-start xl:grid-rows-2 xl:grid-cols-2 grid-cols-1 w-full"} ref={gridRef}>
                {Object.entries(props.details).slice(0, 3).map(([key, value], index) => (
                    <div key={index} className={index >= 3 ? 'hidden' : ''}>
                        <p className={"xl:text-sm text-xs font-light"}>{key}</p>
                        <p className={"xl:text-2xl text-lg font-normal"}>{value as string}</p>
                    </div>
                ))}
                {Object.entries(props.details).slice(3).map(([key, value], index) => (
                    <div key={index + 3} className='hidden'>
                        <p className={"xl:text-sm text-xs font-light"}>{key}</p>
                        <p className={"xl:text-2xl text-lg font-normal"}>{value as string}</p>
                    </div>
                ))}
                <a onClick={onClickExpand} className='cursor-pointer'>Mehr ...</a>
            </div>
        </div>
    </div>
)
}

export default InvestmentCard