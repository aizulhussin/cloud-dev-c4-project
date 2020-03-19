import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../lambda/utils'
import {deleteTodo} from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'


const logger = createLogger("deleteTodo")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  logger.info(event.body)
  
  await deleteTodo(userId,todoId)
  

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({})
  }
}
