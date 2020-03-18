import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'



export class DataAccess{
    
    constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.TODOS_TABLE) {
  }
  
  
  async getAllToDos(): Promise<TodoItem[]> {
      
      
      
  }
    
    
}


function createDynamoDBClient() {
    
   return new DocumentClient()
}