import{DataAccess} from '../dataLayer/dataAccess'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'

const dataAccess = new DataAccess()
const logger = createLogger("todo")
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getAllTodos(userId:string) {
  logger.info("getAllTodos")
  const items = await dataAccess.getAllToDos(userId)
  logger.info(items)
  return items;
}

export async function createTodo(userId:string,todoId:string,name:string,dueDate:string){
  logger.info("createTodo")
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


export async function updateTodo(userId:string,todoId:string,updateTodo:UpdateTodoRequest){
    
    logger.info("updateTodo")
    const todoUpdate = updateTodo as TodoUpdate
    return await dataAccess.updateTodo(userId,todoId,todoUpdate)
}


export async function updateAttachmentUrl(userId:string,todoId:string,url:string){
    
    logger.info("updateAttachmentUrl")
    try{
        logger.info("updateAttachmentUrl success")
        return await dataAccess.updateAttachmentUrl(userId,todoId,url)
    }catch(error){
        logger.error(error)
    }
}


export async function deleteTodo(userId:string,todoId:string){
    logger.info("deleteTodo")
    return await dataAccess.deleteTodo(userId,todoId)
}


export function getUploadUrl(todoId: string,contentType:string) {
  
  logger.info("getUploadUrl")
  logger.info(bucketName)
  
  logger.info(AWS.config.credentials)
  logger.info(AWS.config.region)
  logger.info(contentType)
  
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    ContentType:contentType,
    Expires: urlExpiration
  })
}



