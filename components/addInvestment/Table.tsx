"use client"
import React, { useEffect, ReactNode, useState} from 'react'
import { cn } from '@/lib/utils';
import { AddButton } from '@/components/addInvestment/addCategoryButton';
import { SaveButton } from '@/components/addInvestment/saveInvestmentButton';
import { KeyButton } from '@/components/addInvestment/keyButton';
import { ValueButton } from '@/components/addInvestment/valueButton';
type Props = {
    items: {},
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
    const [selectionList, setselectionList] = useState<{}>({})
    const [modifyableList, setModifyableList] = useState<{}>(props.items)
    
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
                    if(keyI in newModList){
                    }
                    else{
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
            deleteFromSelection(node,modifyableList,selectionList)
            const newCat = (e.target as HTMLFormElement)['newCategory'].value as string;
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
            console.log(inputType)
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
                console.log(updateList)
                console.log(modifyableList)
                console.log(rest)
                console.log(modifyableList["Mehr..." as keyof typeof modifyableList])
                setModifyableList(rest)
                // const {[key as keyof typeof modifyableList]: trash,["Mehr..." as keyof typeof modifyableList]:omitted,...rest} = modifyableList
                // const updateList = {...rest,["Mehr"]:{...modifyableList["Mehr..." as keyof typeof modifyableList] as {,}}};
                // setModifyableList(updateList)
                delete selectionList[key as keyof typeof selectionList];
            }} />)
        })}
        if(JSON.stringify(buttons) !== JSON.stringify(keyButtonList)){
            setkeyButtonList(buttons)
        }
        
    }, [selectionList, modifyableList, keyButtonList, valueButtonList])

    
    const clearList = () => {
        setselectionList({})
        setModifyableList(props.items)
        setDisplayed(false)
        setvalueButtonList([])
        setkeyButtonList([])
    }
    
    return (
        <div className=' w-[80vw] flex xl:flex-row flex-col gap-8 overflow-hidden'>
                <div className={  cn(displayed && " max-h-[calc(50%-32px)]", " flex-col flex gap-2 bg-sec border-def p-4 overflow-y-scroll scroll-light dark:scroll-dark rounded-md xl:w-[calc(50%-32px)] items-center xl:max-h-full xl:h-fit",props.className)}>
                    {keyButtonList}
                    <SaveButton data={selectionList} onClick={clearList} />
                </div>
                {displayed && 
                    <div className={cn("flex-col flex gap-2 bg-sec border-def p-4 overflow-y-scroll scroll-light dark:scroll-dark rounded-md xl:w-1/2 items-center xl:max-h-full xl:h-fit h-fit max-h-[50%]",props.className)}>
                        {valueButtonList}
                    </div>
                }
        </div>
    )
}
