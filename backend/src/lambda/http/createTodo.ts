import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {getUserId} from '../../lambda/utils' 
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const newItem = createToDo(userId,todoId,newTodo);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem,
    })
  }
}


async function createToDo(userId:string,todoId:string,createTodoRequest:CreateTodoRequest){
  
  const timestamp = new Date().toISOString()
  const done = false;
  
  const newItem = {
    userId,
    todoId,
    timestamp,
    done,
    createTodoRequest,
  }
  
  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
  
}