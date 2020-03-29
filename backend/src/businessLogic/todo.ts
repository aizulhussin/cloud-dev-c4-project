import{DataAccess} from '../dataLayer/dataAccess'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const dataAccess = new DataAccess()
const logger = createLogger("todo")

export async function getAllTodos(userId:string) {
  try{
    logger.info("getAllTodos")
    const items = await dataAccess.getAllToDos(userId)
    logger.info(items)
    return items;
  }
  catch(error){
    logger.error(error)
    return {}
  }
}

export async function createTodo(userId:string,todoId:string,name:string,dueDate:string){
  
  logger.info("createTodo")
  
  try{
    const createdAt = new Date().toISOString()
    const done = false;
    const attachmentUrl = "none"
    const newItem = {
      userId,
      todoId,
      createdAt,
      done,
      name,
      dueDate,
      attachmentUrl
    }
    
    logger.info(newItem)
    const item = newItem as TodoItem
    logger.info(item)
    return await dataAccess.createTodo(item)
  }
  catch(error){
    logger.error(error)
    return {}
  }
  
}


export async function updateTodo(userId:string,todoId:string,updateTodo:UpdateTodoRequest){
    
    try{
      logger.info("updateTodo")
      const todoUpdate = updateTodo as TodoUpdate
      return await dataAccess.updateTodo(userId,todoId,todoUpdate)
    }
    catch(error){
      logger.error(error)
    }
}


export async function updateAttachmentUrl(userId:string,todoId:string){
    
    logger.info("updateAttachmentUrl")
    try{
        logger.info("updateAttachmentUrl success")
        return await dataAccess.updateAttachmentUrl(userId,todoId)
    }catch(error){
        logger.error(error)
    }
}


export async function deleteTodo(userId:string,todoId:string){
    try{
      logger.info("deleteTodo")
      return await dataAccess.deleteTodo(userId,todoId)
    }catch(error){
      logger.error(error)
    }
}


export async function getUploadUrl(todoId: string,contentType:string,userId:string) {
  
  try{
    logger.info("getUploadUrl")
    const url = dataAccess.getSignedUrl(todoId,contentType)
    await updateAttachmentUrl(userId,todoId)
    logger.info(url)
    return url
  
  }catch(error){
    logger.error(error)
  }
  
}



