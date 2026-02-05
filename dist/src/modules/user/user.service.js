import { ApiError } from "../../utils/api-error.js";
import { comparePassword, hashPassword } from "../../lib/argon.js";
export class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getUsers = async (query) => {
        const { page, sortBy, sortOrder, take, search } = query;
        const whereClause = {
            deletedAt: null,
        };
        if (search) {
            whereClause.name = { contains: search, mode: "insensitive" };
        }
        const users = await this.prisma.user.findMany({
            where: whereClause,
            take: take,
            skip: (page - 1) * take,
            orderBy: { [sortBy]: sortOrder },
            omit: { password: true },
        });
        const total = await this.prisma.user.count({ where: whereClause });
        return {
            data: users,
            meta: { page, take, total },
        };
    };
    getUser = async (id) => {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            omit: { password: true },
        });
        if (!user)
            throw new ApiError("User not found", 404);
        return user;
    };
    createUser = async (body) => {
        await this.prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role,
                referralCode: body.referralCode,
                point: body.point,
                avatar: body.avatar,
            },
        });
        return { message: "create user success" };
    };
    updateUser = async (id, body) => {
        await this.getUser(id);
        if (body.email) {
            const userEmail = await this.prisma.user.findUnique({
                where: { email: body.email },
            });
            if (userEmail)
                throw new ApiError("email already exist", 400);
        }
        await this.prisma.user.update({
            where: { id },
            data: body,
        });
        return { message: "update user success" };
    };
    /**
     * Update user password
     * - Verify old password matches current hashed password in database
     * - If match, hash new password and update
     */
    updatePassword = async (id, body) => {
        // Get user with password (we need the password for comparison)
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });
        if (!user)
            throw new ApiError("User not found", 404);
        // Verify old password matches current password
        const isOldPasswordValid = await comparePassword(body.oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new ApiError("Old password is incorrect", 400);
        }
        // Verify new password is not the same as old password
        if (body.newPassword === body.oldPassword) {
            throw new ApiError("New password cannot be the same as old password", 400);
        }
        // Hash new password
        const hashedNewPassword = await hashPassword(body.newPassword);
        // Update password in database
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword },
        });
        return { message: "Password updated successfully" };
    };
    /**
     * Update user profile (name, email, phone)
     */
    updateProfile = async (id, body) => {
        await this.getUser(id);
        // If email is being updated, check if it's already taken by another user
        if (body.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: body.email,
                    id: { not: id }, // Exclude current user
                },
            });
            if (existingUser) {
                throw new ApiError("Email already exist", 400);
            }
        }
        // Build update data object with only provided fields
        const updateData = {};
        if (body.name !== undefined)
            updateData.name = body.name;
        if (body.email !== undefined)
            updateData.email = body.email;
        if (body.phone !== undefined)
            updateData.phone = body.phone;
        if (body.avatar !== undefined)
            updateData.avatar = body.avatar;
        await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        return { message: "Profile updated successfully" };
    };
    deleteUser = async (id) => {
        await this.getUser(id);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: "delete user success" };
    };
}
