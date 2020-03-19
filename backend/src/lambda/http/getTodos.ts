import 'source-map-support/register'
import { getUserId } from '../../lambda/utils' 
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getAllTodos} from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'


const logger = createLogger("getTodos")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("execute getTodos")
  logger.info(event.body)
  
  const userId = getUserId(event)
  
  const items = await getAllTodos(userId)
  logger.info(items)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
  
}
