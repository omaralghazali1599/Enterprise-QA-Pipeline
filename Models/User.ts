import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
export default class User {
    private firstName:string;
    private lastName:string;
    private email:string;
    private password:string;
    private access_token: string | undefined;
    //private userID:string;
    constructor(){
        this.firstName = faker.person.firstName();
        this.lastName = faker.person.lastName();
        this.email = `qa.${Date.now()}.${randomUUID().slice(0, 8)}@example.com`;
        this.password = "Password123";
    }
    getFirstName(){
        return this.firstName
    }
    getLasttName(){
        return this.lastName
    }
    getEmail(){
        return this.email
    }
    getPassword(){
        return this.password
    }
    getAccessToken(){
        return this.access_token
    }
    setAccessToken(access_token:string){
        this.access_token = access_token;
    }
}