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
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send({ message: "Internal server error" });
        }
    };
    resetPassword = async (req, res) => {
        const { token, newPassword } = req.body;
        const result = await this.authService.resetPassword(token, newPassword);
        res.status(200).send(result);
    };
}
