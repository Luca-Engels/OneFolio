"use client"
import React, { useEffect, ReactNode, useState, useRef} from 'react'
import { cn } from '@/lib/utils';
import { AddButton } from '@/components/addInvestment/addCategoryButton';
import { SaveButton,SaveCSVButton } from '@/components/addInvestment/saveInvestmentButton';
import { KeyButton } from '@/components/addInvestment/keyButton';
import { ValueButton } from '@/components/addInvestment/valueButton';
import { Button } from '../ui/button';
import { IconEdit,IconTrash,IconDeviceFloppy } from '@tabler/icons-react';
import { Input } from '../ui/input';
import * as T from "@/components/ui/tooltip"
type Props = {
    items: {},
    startSelection?:{},
    className?: string;
}


// * Uses an object to find and changes the value of the object to the to Add array. The iterate object is the list that the toFind Object belongs to. The comments in the function show the current state and the variables that are at each position...
//! JUST WORKS :D
export const editObject = (toFind: {}, iterate: {},toAdd:any[]) => {

    // iterate = {Branche: []} || {Laufzeit: []} || {Title: []}
    var fullNewList = {}

    for (var i =0; i < Object.keys(iterate).length; i++){
        const key = Object.keys(iterate)[i]
        const value = iterate[key as keyof typeof iterate] as []
        //Branche : [{},{},{},{}] || Laufzeit : [1,2,3,4,5] || Title : []
        if(JSON.stringify({[key]:value}) === JSON.stringify(toFind)){
            fullNewList = {...fullNewList,[key]:[...value, ...toAdd]}
        }
        else if(value.length > 0){
            var newList:any[] = []
            for(var j = 0; j < value.length; j++){
                // value[j] = {Energie:{}} || value[j] = 1
                if (typeof value[j] == typeof {}) {
                    for (var k = 0; k < Object.keys(value[j]).length; k++) {
                        // Object.keys(value[j])[k] = Energie
                        // value[j][Object.keys(value[j])[k]] = {Sparte: []}}
                        const obj = editObject(toFind, value[j][Object.keys(value[j])[k]], toAdd)
                        newList = [...newList, {[(Object.keys(value[j])[k])]:obj}]
                    }
                } else {
                    newList = [...newList, value[j]]
                }
            }
            fullNewList = {...fullNewList,[key]:newList}
        }
        else{
            fullNewList = {...fullNewList,[key]:value}
        }
    }
    return fullNewList
}

//deletes key of value from selList in modList
export const deleteFromSelection = (toDelete: string, modList: {}, selList: {}) => {
    const one = modList[toDelete as keyof typeof modList] as []
    const two = selList[toDelete as keyof typeof selList]
    var index = 0;
    if(two){
        one.map((value) => {
            if(Object.keys(value)[0] === two){
                index = one.indexOf(value)
            }
    
        })
        const c = modList[toDelete as keyof typeof modList][index][two]
        if(c){
            Object.keys(c).map((value) => {
                delete modList[value as keyof typeof modList]
            })
        }
    }
}


export const Table = (props: Props) => {
    const [keyButtonList, setkeyButtonList] = useState<ReactNode[]>([])
    const [valueButtonList, setvalueButtonList] = useState<ReactNode[]>()
    const [displayed, setDisplayed] = useState<boolean>(false)
    const [selectionList, setselectionList] = useState<{}>(props.startSelection||{})
    const [modifyableList, setModifyableList] = useState<{}>(props.items)
    const [CSVList,setCSVList] = useState<{}[]>([])
    const [CSVListElements,setCSVListElements] = useState<ReactNode[]>([])
    const [CSVDisplayed,setCSVDisplayed] = useState(false)
    const [CSVIsEditing,setCSVIsEditing] = useState<{}>()
    
    useEffect(() => {
    
        const onClickValueButton = (key:string,forKey:string)  => {
            setDisplayed(false)
            deleteFromSelection(forKey,modifyableList,selectionList)
            if("Mehr..." == forKey){
                const valueName=Object.keys(key)[0];
                const array = modifyableList[forKey as keyof typeof modifyableList] as string[]
                const index = array.indexOf(key)
                if(index !== -1){
                    array.splice(index,1)
                }
                var newModList = {}
                
                Object.entries(modifyableList).map(([keyI, valueI]) => {
                    if(keyI === forKey){
                        newModList = {...newModList,...key[valueName as keyof typeof key] as {}}
                    }
                    newModList = {...newModList, [keyI]: valueI};
                })
                setModifyableList(newModList)
            }
            else if(typeof key != 'object') {
                setselectionList({ ...selectionList, [forKey]: key});
            }
            else{
                const valueName=Object.keys(key)[0];
                var newModList = {}
                if(Object.keys(key[valueName])[0] in selectionList){
                    delete selectionList[Object.keys(key[valueName])[0] as keyof typeof selectionList]
                }
                Object.entries(modifyableList).map(([keyI, valueI]) => {
                    if(!(keyI in newModList)){
                        newModList = {...newModList, [keyI]: valueI};
                        if(keyI === forKey){
                            newModList = {...newModList,...key[valueName] as {}}
                        }
                    }
                })
                setModifyableList(newModList)
                setselectionList({ ...selectionList, [forKey]: valueName });
            }
        }

        const handleAddButtonSubmit = (e:any,node:string) => {
            e.preventDefault();
            if((e.target as HTMLFormElement)['newCategory']==undefined||!(e.target as HTMLFormElement)['newCategory'].value){
                return;
            }
            deleteFromSelection(node,modifyableList,selectionList)
            var newCat = (e.target as HTMLFormElement)['newCategory'].value as string;
            if(/[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/.test(newCat)){
                const split = newCat.split("-")
                console.log(split)
                newCat = split[2]+"."+split[1]+"."+split[0]
                console.log(newCat)
            }
            const type = e.target['inputType']?e.target['inputType'].value as string:undefined
            if(newCat == ''){
                return
            }
            const subCat = e.target["subCategory"]?e.target['subCategory'].value:undefined;
            if(node == "Mehr..."){
                setDisplayed(false)
                const { ["Mehr..." as keyof typeof modifyableList]: omitted, ...rest } = modifyableList;
                setModifyableList({...rest, [newCat]: [type ? type : "text"],["Mehr..."]:omitted});
                return;
            }
            if(!subCat){
                const curr = { [node]: modifyableList[node as keyof typeof modifyableList] as {} };
                //iterate and check if curr is in modyfiableList
                const listKeyValue = editObject(curr, modifyableList, [newCat]);
                setModifyableList(listKeyValue)
            }
            else{
                const newCatSub = {[newCat]: {[subCat]:[type?type:"text"]}}
                const curr = { [node]: modifyableList[node as keyof typeof modifyableList] as {} };
                var newList = {}
                Object.entries(editObject(curr, modifyableList, [newCatSub])).map(([key, value]) => {
                    newList = {...newList, [key]: value}
                    if(node == key){
                        newList = {...newList, [subCat]: [type?type:"text"]}
                    }
                })
                setModifyableList(newList)
            }
            setDisplayed(false)
            setselectionList({...selectionList, [node]: newCat})
        }
        
        const createValueList = (node: string) => {
            var buttons :ReactNode[] = []
            for(var i = 1; i < Object.keys(modifyableList[node as keyof typeof modifyableList]).length; i++){
                const buttonName = modifyableList[node as keyof typeof modifyableList][i]
                buttons.push(<ValueButton key={i} index={i} name={buttonName} onClick={()=>{onClickValueButton(buttonName, node)}} />)
            }
            let inputType
            if(Object.keys(modifyableList[node as keyof typeof modifyableList]).length>0){
                inputType = modifyableList[node as keyof typeof modifyableList][0]
            }
            buttons.push(<AddButton node={node} onSubmit={(e)=>{handleAddButtonSubmit(e,node)}} inputType={inputType} key={Object.keys(modifyableList[node as keyof typeof modifyableList]).length}/>)
            setvalueButtonList(buttons)
            setDisplayed(true)
        }
    
        //TODO Clear modyfiableList of subelements (found twice in the list)
        var buttons :ReactNode[] = []
        if(Object.keys(modifyableList).length === 0){
            setModifyableList({"Titel":['text'],"Mehr...":['text',{"Startdatum des Investments":{"Startdatum des Investments":['date']}}]})
        }
        {Object.entries(modifyableList).map(([key,value], index) => {
            buttons.push(<KeyButton name={key} index={index} key={index} selecList={selectionList}  onClick={() =>{createValueList(key)}} deleteItem={()=>{
                setDisplayed(false)
                const updateList = {...modifyableList, "Mehr...": [...modifyableList["Mehr..." as keyof typeof modifyableList] as [], {[key]: {[key]: modifyableList[key as keyof typeof modifyableList]}}]};
                const {[key as keyof typeof updateList]: omitted, ...rest} = updateList;
                setModifyableList(rest)
                delete selectionList[key as keyof typeof selectionList];
            }} />)
        })}
        if(JSON.stringify(buttons) !== JSON.stringify(keyButtonList)){
            setkeyButtonList(buttons)
        }
    }, [selectionList, modifyableList, keyButtonList, valueButtonList])


    
    useEffect(()=>{
        let finalData:ReactNode[] = []
        CSVList.map((element,indx)=>{
            let newElement:{} = element
            let data:ReactNode[] = []
            Object.entries(element).map(([key,value],index)=>{
                data.push(<div key={index} className={"flex flex-col"}>
                            <p className={"text-small"}>{key}</p>
                            {CSVIsEditing==element?<input type={'text'} onChange={(e)=>{
                                const newValue = e.target.value as string
                                newElement = {...newElement,[key]:newValue}
                            }} placeholder={value as string} className='w-full text-left text-big p-2 border-0 bg-transparent' />:<p className={"text-big"}>{value as string}</p>}
                        </div>)
            })
            finalData.push(<div key={indx} className={"bg-prim border-def rounded-lg flex flex-row p-4"}>
                <div className='grid grid-cols-3 px-4 py-8 w-full'>{data}</div>
                <div className='flex flex-col gap-2 justify-center'>
                    <Button onClick={()=>{
                        const index = CSVList.indexOf(element)
                        CSVList.splice(index,1)
                        setCSVList([...CSVList])
                    }}>
                        <IconTrash />
                    </Button>
                    <Button onClick={()=>{
                        if(CSVIsEditing){
                            setCSVIsEditing(undefined)
                            CSVList[indx] = newElement
                            setCSVList([...CSVList])
                        }
                        else{
                            setCSVIsEditing(element)
                        }
                    }}>
                        {CSVIsEditing?<IconDeviceFloppy />:<IconEdit />}
                    </Button>
                </div>
            </div>)
        })
        if(finalData.length>=1){
            setCSVDisplayed(true)
        }
        setCSVListElements(finalData)
    },[CSVList,CSVIsEditing])
    
    const clearList = () => {
        setselectionList({})
        setModifyableList(props.items)
        setDisplayed(false)
        setvalueButtonList([])
        setkeyButtonList([])
    }
    return (
        <div className='w-full h-full flex xl:flex-row flex-col xl:gap-8 gap-2 overflow-hidden'>
                <div className={cn(displayed && " max-h-[calc(50%-32px)]", " flex-col flex gap-2 bg-sec border-def p-4 overflow-y-auto scroll-light dark:scroll-dark rounded-md xl:w-[calc(50%-32px)] items-center xl:max-h-full xl:h-fit",props.className)}>
                    {keyButtonList}
                    <SaveButton data={selectionList} onClick={clearList}/>
                        <T.Tooltip>
                            <T.TooltipTrigger>
                                <Input type="file" placeholder='Eine CSV mit Investments hochladen' multiple={false} accept=".csv" className='text-medium bg-primary file:text-primary-foreground text-primary-foreground border-border border-2' onChange={(e) => {
                                    handleFileUpload(e,setCSVList);
                                }} />
                            </T.TooltipTrigger>
                            <T.TooltipContent>
                                Hier kannst du eine CSV Datei hochladen um schnell Investments hinzuzufügen.<br/> Denk daran deiner CSV Datei eine Überschrift zu geben und eine Reihe mit Titeln zu haben.
                            </T.TooltipContent>
                        </T.Tooltip>
                </div>
                {displayed && 
                    <div className={cn("flex-col flex gap-2 bg-sec border-def p-4 overflow-y-auto scroll-light dark:scroll-dark rounded-md xl:w-1/2 items-center xl:max-h-full xl:h-fit h-fit max-h-[50%]",props.className)}>
                        {valueButtonList}
                    </div>
                }
                {CSVDisplayed&&CSVListElements.length>0&&<div className={"absolute w-4/5 h-4/5 p-16 flex flex-col gap-4 bg-sec border-def overflow-y-auto overflow-x-hidden rounded-lg"}>
                    {CSVListElements}
                    <SaveCSVButton data={CSVList} onClick={()=>{}} />
                </div>}
        </div>
    )
}


const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>,setCSVList:(arg0: {}[])=>void) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                const data = text.split('\n').map(row => row.replace("\r","").split(','));
                if(data.length >=2){
                    const categories = data[0]
                    console.log(data[0])
                    if(categories.includes('Titel')){
                        const returnData:{}[] = []
                        for (let index = 1; index < data.length-1; index++) {
                            const element = data[index];
                            let dataList = {}
                            for (let j = 0; j < categories.length; j++) {
                                if(element[j]!=''){
                                    dataList = {...dataList,[categories[j]]:element[j]}
                                }
                            }
                            returnData.push(dataList)
                        }
                        setCSVList(returnData)
                    }
                    else{
                        alert("Die Datei beinhaltet keinen Titel. Bitte füge einen Titel zu der CSV Datei hinzu")
                    }
                }
            }
        };
        reader.readAsText(file);
    }
};
