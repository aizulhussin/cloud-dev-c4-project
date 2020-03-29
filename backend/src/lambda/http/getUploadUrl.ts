import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../lambda/utils'
import {getUploadUrl} from '../../businessLogic/todo'



const logger = createLogger("GetUploadUrl")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  
  logger.info("getUploadUrl")
  logger.info(event.body)
  
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const contentType = event.headers['content-type']
  
  const url = await getUploadUrl(todoId,contentType,userId);
  
  logger.info(url)
  
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      url
    })
  }
}
