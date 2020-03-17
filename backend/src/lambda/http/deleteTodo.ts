import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../lambda/utils'

const todosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  var params = {
    TableName:todosTable,
    Key:{
        "userId":userId,
        "todoId": todoId,
    }
  };
  
  docClient.delete(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  }
  else {
    console.log(data);
    
  }
});

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({})
  }
}
