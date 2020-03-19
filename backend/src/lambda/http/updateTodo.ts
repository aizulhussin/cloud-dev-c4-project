import 'source-map-support/register'
import { getUserId } from '../../lambda/utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {updateTodo} from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'


const logger = createLogger("updateTodo")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updateTodoReq: UpdateTodoRequest = JSON.parse(event.body)
  
  logger.info(event.body)
  
  await updateTodo(userId,todoId,updateTodoReq)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}
