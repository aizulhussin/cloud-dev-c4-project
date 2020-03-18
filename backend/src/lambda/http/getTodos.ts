import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { getUserId } from '../../lambda/utils' 
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getAllTodos} from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'


const logger = createLogger("getTodos")
//const todosTable = process.env.TODOS_TABLE
//const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("execute getTodos")
  
  const userId = getUserId(event)
  
  /*const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()

  const items = result.Items*/
  
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
