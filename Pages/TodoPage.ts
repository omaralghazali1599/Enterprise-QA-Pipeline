import { APIRequestContext, Page } from "@playwright/test";
import TodoApi from "../API/TodoAPI";
import User from "../Models/User";
export default class TodoPage {
    private page: Page;
    private request?: APIRequestContext;
    //Constructor
    constructor(page: Page, request?: APIRequestContext) {
        this.page = page;
        this.request = request;
    }
    //Elements
    // Get welcomeMessage element
    private get welcomeMessage() { return '[data-testid="welcome"]' }
    // Get Todo item element
    private get todoItem() { return '[data-testid="todo-item"]' }
    // Get DeleteTodo icon element
    private get deleteIcon(){return '[data-testid="delete"]'} 
    // Get NoTodo Message element
    private get noTodoMessage(){return '[data-testid="no-todos"]'}
    //Methods
    async load(){
        await this.page.goto("/todo")
    }
    getWelcomeMessage() {
        return this.page.locator(this.welcomeMessage);
    }
    getTodoByIndex(index: number) {
        return this.page.locator(this.todoItem).nth(index);   // return locator, not string
}
    async addTodoUsingApi(user: User) {
        return await new TodoApi(this.request!).addTodo(user)
    }   
    async deleteTodoByIndex(index:number){
        await this.page.locator(this.deleteIcon).nth(index).click();
    }
    getNoTodoMessge(){
        return this.page.locator(this.noTodoMessage);
    }
    
}
