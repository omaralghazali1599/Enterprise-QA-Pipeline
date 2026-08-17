import { APIRequestContext } from "@playwright/test";
import User from "../Models/User";
export default class TodoApi {
    private request: APIRequestContext;
    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async addTodo(user: User, item = 'Playwright', isCompleted = false) {
        return await this.request.post('/api/v1/tasks', {
            data: { isCompleted, item },
            headers: { Authorization: `Bearer ${user.getAccessToken()}` }
  });
}
}