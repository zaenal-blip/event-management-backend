import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await this.authService.register(body);
    res.status(200).send(result);
  };
  login = async (req: Request, res: Response) => {
    const body = req.body;
    const result = await this.authService.login(body);
    res.status(200).send(result);
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const result = await this.authService.getProfile(req.user.id);
    res.status(200).send(result);
  };
}
