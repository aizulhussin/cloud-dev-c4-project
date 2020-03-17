import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../../lambda/utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const todosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  
  var params = {
    TableName:todosTable,
    Key:{
        "userId":userId,
        "todoId": todoId,
    },
    UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
        ":name":updatedTodo.name,
        ":dueDate":updatedTodo.dueDate,
        ":done":updatedTodo.done
    },
    ReturnValues:"UPDATED_NEW"
  };
  
  
  console.log("Updating the item...");
  
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
  

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}
