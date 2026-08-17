import { APIRequestContext, BrowserContext, Page, expect } from "@playwright/test";
import User from "../Models/User";
import UserApi from "../API/UserAPI";
import { BASE_URL } from "../config/env";

export default class RegisterPage {

    private page: Page;
    private request?: APIRequestContext;
    private context?: BrowserContext;

    //Constructor
    constructor(page: Page, request?: APIRequestContext, context?: BrowserContext) {
        this.page = page;
        this.request = request;
        this.context = context
    }
    //Elements

    // Get firstName element
    private get firstNameInput() { return '[data-testid="first-name"]'; }

    // Get lastName element
    private get lastNameInput() { return '[data-testid="last-name"]'; }

    // Get email element
    private get emailInput() { return '[data-testid="email"]'; }

    // Get password element
    private get passwordInput() { return '[data-testid="password"]'; }

    // Get confirmPassword element
    private get confirmPasswordInput() { return '[data-testid="confirm-password"]'; }

    // Get submitButton element
    private get submitButton() { return '[data-testid="submit"]'; }

    //Methods

    async load() {
        await this.page.goto('/signup');
    }

    async register(user: User) {
        await this.page.fill(this.firstNameInput, user.getFirstName());
        await this.page.fill(this.lastNameInput, user.getLasttName());
        await this.page.fill(this.emailInput, user.getEmail());
        await this.page.fill(this.passwordInput, user.getPassword());
        await this.page.fill(this.confirmPasswordInput, user.getPassword());
        await this.page.click(this.submitButton);
    }

    async registerUsingApi(user: User) {
        const response = await new UserApi(this.request!).register(user)
        expect(response.ok(), `Registration failed: ${response.status()} ${await response.text()}`).toBeTruthy();
        // Set cookies
        const responseBody = await response.json();
        const acessToken = responseBody.access_token;
        const firstName = responseBody.firstName;
        const userID = responseBody.userID;
        user.setAccessToken(acessToken);

        await this.context!.addCookies([    
            {
                name: 'access_token',
                value: acessToken,
                url: BASE_URL,
            },
            {
                name: 'firstName',
                value: firstName,
                url: BASE_URL,
            },
            {
                name: 'userID',
                value: userID,
                url: BASE_URL,
            }
        ]);
    }
}