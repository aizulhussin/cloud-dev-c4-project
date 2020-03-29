
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'


const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const region = process.env.REGION

export class DataAccess{
    
    

    
    constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly logger = createLogger("DataAccess"),
    private readonly s3 = createS3Client(),)
    {}
  
  
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
  
  
  async updateAttachmentUrl(userId:string,todoId:string){
    try{
        
        const url = `https://${bucketName}.s3-${region}.amazonaws.com/${todoId}`
        
        var params = {
            TableName:this.todosTable,
            Key:{
                "userId":userId,
                "todoId": todoId,
            },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues:{
                ":url":url
            },
            ReturnValues:"UPDATED_NEW"
          };
          
          return await this.docClient.update(params).promise()
    }catch(error){
        this.logger.error(error)
    }
  }
  
  
  async getSignedUrl(todoId:string,contentType:string){
      
      this.logger.info("getSignedUrl")
      
      try{
          const url = await  this.s3.getSignedUrl('putObject', {
                Bucket: bucketName,
                Key: todoId,
                ContentType:contentType,
                Expires: urlExpiration
              })
              
          this.logger.info(url)      
              
          return url
          
      }catch(error){
          this.logger.error(error)
      }  
          
          
          
  }
  
  
  
  //updateToDo
  async updateTodo(userId:string,todoId:string,item:TodoUpdate){
      try{
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
      }catch(error){
          this.logger.error(error)
      }
      
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
    
    this.logger.info("deleteTodo")
    try{
        var params = {
            TableName:this.todosTable,
            Key:{
                "userId": userId,
                "todoId": todoId,
            }
         };
         this.logger.info("delete todo success")
         return await this.docClient.delete(params).promise()
     
    }catch(error){
        this.logger.info(error)
        return {}
    }
  }
  
}


function createS3Client(){
    return new AWS.S3({
    signatureVersion: 'v4'
    })
}


function createDynamoDBClient() {
   return new DocumentClient()
}