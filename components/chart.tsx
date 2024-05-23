"use client";
import {
  Chart as ChartJS,
  registerables
} from "chart.js/auto";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Chart as ReactChart } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(...registerables);

interface LineProps {
  data: {[key:string]:any[][]};
  diagramKey:string,
  type: "line"|"bar"|"pie"|"radar",
  title?:string,
}

export const MarketChart= ({type:startType, data:getData, title,diagramKey }:LineProps) => {
  const [chartData, setChartData] = useState<any[][]>(getData[diagramKey]);
  const [isDarkTheme, setisDarkTheme] = useState<boolean>(false);
  const [diagramValue,setDiagramValue] = useState<string>(diagramKey);
  const [type,setType] = useState<"line"|"bar"|"pie"|"radar">(startType);


  const onChange= (e:ChangeEvent) => {
    e.preventDefault()
    const selectedValue = (e.target as HTMLSelectElement).value
    setDiagramValue(selectedValue)
  }
  const onChangeBar= (e:ChangeEvent) => {
    e.preventDefault()
    const selectedValue = (e.target as HTMLSelectElement).value
    setType(selectedValue as "line"|"bar"|"pie"|"radar")
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartData(getData[diagramValue]);
      } catch (error) {
      }
    };
    fetchData();
  }, [getData,diagramValue]);
  useEffect(() => {
  
    if(typeof window != "undefined" && window.matchMedia){
      setisDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }

  },[])
  if (!chartData) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-12 w-12"></div>
      </div>
    );
  }
  let borderColor
  let backgroundColor
  if(isDarkTheme){
    borderColor = generateGradientHexList("c68700","ffcf00",chartData.length)
    backgroundColor = generateGradientHexList("c68700","ffcf00",chartData.length,true)
  }
  else{
    borderColor = generateGradientHexList("284cb3","385eff",chartData.length)
    backgroundColor = generateGradientHexList("284cb3","385eff",chartData.length,true)
  }
  
  const data = {
    labels: chartData.map((entry: any) => entry[0]),
    datasets: [
      {
        label: diagramValue,
        data: chartData.map((entry: any) => entry[1]),
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  return(
    <div className="w-full h-64 flex flex-col justify-center items-start">
      <p className={"text-2xl font-medium"}>{title?title:"Deine "+diagramValue}</p>
      <div className="flex flex-row gap-2">
        <select name="inputType" id="inputType" className='bg-prim' onChange={onChange}>
          {Object.keys(getData).map((valueKey,index)=>{
            console.log(valueKey,index)
            return(<option key={index} value={valueKey}>{valueKey}</option>)
          })}
        </select>
        <p>als</p>
        <select name="ChartType" id="ChartType" className='bg-prim' onChange={onChangeBar}>
          <option value="pie">Kreis</option>
          <option value="line">Linie</option>
          <option value="bar">Bar</option>
          <option value="radar">Netz</option>
        </select>
      </div>
      <ReactChart type={type} data={data} options={options} />
    </div>
  )
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      min:0,
    }

  },
};


export function generateGradientHexList(startColor: string, endColor: string, steps: number,alpha?:boolean): string[] {
  const start = {
    r: parseInt(startColor.slice(0, 2), 16),
    g: parseInt(startColor.slice(2, 4), 16),
    b: parseInt(startColor.slice(4, 6), 16)
  };
  const end = {
    r: parseInt(endColor.slice(0, 2), 16),
    g: parseInt(endColor.slice(2, 4), 16),
    b: parseInt(endColor.slice(4, 6), 16)
  };

  if(steps ==1){
    const g = Math.round((end.r + start.r) / 2).toString(16).padStart(2, '0');
    const b = Math.round((end.g + start.g) / 2).toString(16).padStart(2, '0');
    const r = Math.round((end.b + start.b) / 2).toString(16).padStart(2, '0');
    return [alpha?`#${r}${g}${b}80`:`#${r}${g}${b}`];
  }
  const step = {
      r: (end.r - start.r) / (steps - 1),
      g: (end.g - start.g) / (steps - 1),
      b: (end.b - start.b) / (steps - 1),
    };
  return Array.from({length: steps}, (_, i) => {
    const r = Math.round(start.r + step.r * i).toString(16).padStart(2, '0');
    const g = Math.round(start.g + step.g * i).toString(16).padStart(2, '0');
    const b = Math.round(start.b + step.b * i).toString(16).padStart(2, '0');
    return alpha?`#${r}${g}${b}80`:`#${r}${g}${b}`;
  });
}