import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../lambda/utils'
import {updateAttachmentUrl,getUploadUrl} from '../../businessLogic/todo'

/*const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})*/

const logger = createLogger("GetUploadUrl")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("getUploadUrl")
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const url = getUploadUrl(todoId);
  logger.info(url)
  
  await updateAttachmentUrl(userId,todoId,url)
  
  
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


/*function getUploadUrl(todoId: string,contentType:string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    ContentType: contentType,
    Expires: urlExpiration
  })
}*/
