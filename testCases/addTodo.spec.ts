import { test, expect } from '@playwright/test';
import User from '../Models/User';
import RegisterPage from '../Pages/RegisterPage';
import NewTodoPage from '../Pages/NewTodoPage';
import TodoPage from '../Pages/TodoPage';
test("Create a todo task: ", async ({ page, request, context }) => {
    const user = new User();
    const registerPage = new RegisterPage(page, request, context);
    await registerPage.registerUsingApi(user);
    const newTodoPage = new NewTodoPage(page);
    await newTodoPage.load();
    await newTodoPage.addNewTodo('Playwright')
    const todoPage = new TodoPage(page);
    await expect(page).toHaveURL(/\/todo$/);
    await expect(todoPage.getTodoByIndex(0)).toHaveText('Playwright');
});