
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
  async getAllToDos(userId:string) {
      this.logger.info("getAllToDos")
      
      try{
          const result = await this.docClient.query({
          TableName : this.todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
            }).promise()
            
            const items = result.Items
            this.logger.info("sukses")
            this.logger.info(items)
            return items
      }catch(error){
          this.logger.error(error)
          return {}
      }
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
      
      return await this.docClient.update(params).promise()
      
  }
  
  
  //createTodo
  async createTodo(item:TodoItem){
      try{
      await this.docClient.put({
      TableName: this.todosTable,
      Item: item
    }).promise()
      
        this.logger.info("create todo success")
        return item
          
      }
      catch(error){
        this.logger.error("create todo error")
        return {}
      }
  }
  
  //deleteTodo
  async deleteTodo(userId:string,todoId:string){
    try{
    var params = {
        TableName:this.todosTable,
        Key:{
            "userId": userId,
            "todoId": todoId,
        }
     };
     
     this.logger.info("delete successful")
     return await this.docClient.delete(params).promise()
     
    }catch(error){
        this.logger.info(error)
        return {}
    }
  }
  
}


function createDynamoDBClient() {
   console.log("create documentClient")    
   return new DocumentClient()
}