import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../lambda/utils' 
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import {createTodo} from '../../businessLogic/todo'

const logger = createLogger('CreateTodo')
//const docClient = new AWS.DynamoDB.DocumentClient()
//const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("createToDo")
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const name = newTodo.name
  const dueDate = newTodo.dueDate
  //const newItem = createItem(userId,todoId,name,dueDate)
  //await createToDo(newItem);
  //const responseData = JSON.stringify(newItem);
  //var statusCode = 200;
  
  const items = await createTodo(userId,todoId,name,dueDate)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(items)
  }
}

/*function createItem(userId:string,todoId:string,name:string,dueDate:string){
  
  const timestamp = new Date().toISOString()
  const done = false;
  const imageS3Url = "none"
  
  const newItem = {
    userId,
    todoId,
    timestamp,
    done,
    name,
    dueDate,
    imageS3Url
  }
  
  logger.info(newItem)
  
  return newItem
  
}*/

/*
async function createToDo(item:any){
  
  logger.info("createToDo DynamoDB")
  
  
  await docClient
    .put({
      TableName: todosTable,
      Item: item
    })
    .promise().then(data=>{
      logger.info(data)
    }).catch(error=>{
      logger.error(error)
    })
    
}*/