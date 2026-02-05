export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res) => {
        const body = req.body;
        const result = await this.authService.register(body);
        res.status(200).send(result);
    };
    login = async (req, res) => {
        const body = req.body;
        const result = await this.authService.login(body);
        res.status(200).send(result);
    };
}
