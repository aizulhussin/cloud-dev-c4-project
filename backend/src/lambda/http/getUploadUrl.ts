import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../lambda/utils'
import {updateAttachmentUrl,getUploadUrl} from '../../businessLogic/todo'



const logger = createLogger("GetUploadUrl")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("getUploadUrl")
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const contentType = event.headers['content-type']
  logger.info(event.headers)
  logger.info(contentType)
  const url = getUploadUrl(todoId,contentType);
  
  //`https://${bucketName}.s3.amazonaws.com/${imageId}`
  
  const s3ObjectUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3-${process.env.REGION}.amazonaws.com/${todoId}`
  
  logger.info("Object Url")
  logger.info(s3ObjectUrl)
  logger.info(url)
  
  
  await updateAttachmentUrl(userId,todoId,s3ObjectUrl)
  
  
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
