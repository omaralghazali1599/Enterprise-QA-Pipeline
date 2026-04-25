import { test, expect } from '@playwright/test';
import User from '../Models/User';
import RegisterPage from '../Pages/RegisterPage';
import TodoPage from '../Pages/TodoPage';
test("Delete a todo task: ", async ({ page, request, context }) => {
    const user = new User();
    await new RegisterPage(page, request, context).registerUsingApi(user)
    const todoPage = new TodoPage(page, request);
    await todoPage.addTodoUsingApi(user);
    await todoPage.load();
    await todoPage.deleteTodoByIndex(0);
    const noTodoMessage = todoPage.getNoTodoMessge();
    await expect(noTodoMessage).toBeVisible();
});