import { APIRequestContext } from "@playwright/test";
import User from "../Models/User";

export default class UserApi {

    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request
    }

    async register(user: User) {
        return await this.request.post('/api/v1/users/register', {
            data: {
                email: user.getEmail(),
                firstName: user.getFirstName(),
                lastName: user.getLasttName(),
                password: user.getPassword()
            }
        });
    }
}


