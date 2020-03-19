import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../lambda/utils' 
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import {createTodo} from '../../businessLogic/todo'

const logger = createLogger('CreateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("createToDo")
  
  logger.info(event.body)
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const name = newTodo.name
  const dueDate = newTodo.dueDate
  
  if(name.length == 0){
    return {
      statusCode:404,
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      body:""
    }
  }
  

  const items = await createTodo(userId,todoId,name,dueDate)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(items)
  }
}