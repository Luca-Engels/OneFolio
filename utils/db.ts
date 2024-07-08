import { investment, user } from "@/models/model";
import { BACKEND_URL } from "@/routes";



export const getUserByEmail = async (email:string) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/email/"+email.toLowerCase())
    const user = await response.json()
    return user
  } catch (e){
    console.error(e)
    return null
  }
}
export const createAdvert = async (update:{}) => {
  try {
    const response = await fetch(BACKEND_URL+"/adverts/",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    })
    const users = await response.json()
    return users
  } catch (e){
    console.error(e)
    return null
  }
}
export const updateUser = async (id:string,update:{}) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/"+id+"/", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    })
    const user = await response.json()
    return user
  } catch (e){
    console.error(e)
    return null
  }
}
export const removeFromUser = async (id:string,update:{}) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/"+id+"/", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    })
    const user = await response.json()
    return user
  } catch (e){
    console.error(e)
    return null
  }
}
export const getUserById = async (id:string) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/"+id)
    const user = await response.json()
    return user
  } catch (e){
    console.error(e)
    return null
  }
}
export const createUser = async (data:user) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const user = await response.json()
    return user
  } catch (e){
    console.error(e)
    return null
  }
}
export const createInvestment = async (investmentData:investment) => {
  const response = await fetch(BACKEND_URL+"/investments/",{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(investmentData)
  })
  return response
}


export const createMultipleInvestment = async (investmentData:investment[]) => {
  const response = await fetch(BACKEND_URL+"/investments/addMany",{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(investmentData)
  })
  return response
}

export const getInvestmentsByUserId = async (id:string) => {
  try {
    const response = await fetch(BACKEND_URL+"/users/investments/"+id)
    const investments = await response.json()
    return investments
  } catch (e){
    console.error(e)
    return null
  }
}

export const deleteInvestmentById = async (id:string) => {
  try {
    const response = await fetch(BACKEND_URL+"/investments/"+id,{
      method: "DELETE",
    })
    return response
  } catch (e) {
    console.error(e)
    return null
    
  }
}

export const updateInvestmentById = async (id:string,update:{}) => {
  try {
    const response = await fetch(BACKEND_URL+"/investments/"+id+"/",{
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    })
    return response
  } catch (e) {
    console.error(e)
    return null
    
  }
}


export const getLatestCursorOrUndefined = async (userId:string): Promise<string | undefined> => {
  try {
    const response = await fetch(BACKEND_URL+"/users/"+userId+"/cursor")
    console.log(response)
    const data = await response.json()
    if(data)return data
    return undefined
  } catch (e){
    console.error(e)
    return undefined
  }
}