import { Page } from "@playwright/test";
export default class NewTodoPage {
    private page: Page;
    // Constructor
    constructor(page: Page) {
        this.page = page
    }
    // Elemenets
    private get newTodoInput() {
        return '[data-testid="new-todo"]';
    }
    private get newTodoSubmit() {
        return '[data-testid="submit-newTask"]';
    }
    // Methods
    async load() {
        await this.page.goto("/todo/new");
    }
    async addNewTodo(title: string) {
        await this.page.fill(this.newTodoInput, title);
        await this.page.click(this.newTodoSubmit);
    }
}