
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

export class DataAccess{
    
    constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly logger = createLogger("DataAccess"))
    {}
  
  //getAllToDos
  async getAllToDos(userId:string): Promise<TodoItem[]> {
      this.logger.info("getAllToDos")
      
      const result = await this.docClient.query({
      TableName : this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
        }).promise()

        const items = result.Items
        this.logger.info(items)
        return items as TodoItem[]
  }
  
  //updateToDo
  async updateTodo(userId:string,todoId:string,item:TodoUpdate){
      
        var params = {
        TableName:this.todosTable,
        Key:{
            "userId":userId,
            "todoId": todoId,
        },
        UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues:{
            ":name":item.name,
            ":dueDate":item.dueDate,
            ":done":item.done
        },
        ReturnValues:"UPDATED_NEW"
      };
      
      await this.docClient.update(params)
      .promise()
      .then(data=>{
          this.logger.info(data)
          this.logger.info("Update successful")
      }).catch(error=>{
          this.logger.error(error)
      });
      
  }
  
  
  //createTodo
  async createTodo(item:TodoItem){
      await this.docClient.put({
      TableName: this.todosTable,
      Item: item
    })
    .promise().then(data=>{
      this.logger.info(data)
      this.logger.info("createTodo successful")
    }).catch(error=>{
      this.logger.error(error)
    })
  }
  
  //deleteTodo
  async deleteTodo(userId:string,todoId:string){
    var params = {
        TableName:this.todosTable,
        Key:{
            "userId":userId,
            "todoId": todoId,
        }
     };
     
     this.docClient.delete(params)
     .promise()
     .then(data=>{
         this.logger.info(data)
         this.logger.info("delete success")
     }).catch(error=>{
         this.logger.error(error)
     })
  
  
  }
  
}


function createDynamoDBClient() {
   return new DocumentClient()
}