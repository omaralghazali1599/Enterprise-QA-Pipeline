import { test, expect } from '@playwright/test';
import User from '../Models/User';
import RegisterPage from '../Pages/RegisterPage';
import TodoPage from '../Pages/TodoPage';
test("Register a new User: ", async ({ page }) => {
    const user = new User();
    const registerPage = new RegisterPage(page);
    await registerPage.load();
    await registerPage.register(user);
    const todoPage = new TodoPage(page);
    const welcomeMessage = todoPage.getWelcomeMessage();
    await expect(welcomeMessage).toHaveText(new RegExp(`Good (Evening|Morning|Afternoon|) || TIM TO SLEEP ${user.getFirstName()}`, 'i'));
    });