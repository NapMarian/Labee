import { User, UserType } from '@prisma/client';
import prisma from '../config/database';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

interface RegisterInput {
  email: string;
  password: string;
  userType: UserType;
  name: string;
  location?: string;
  companyName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Validar password
    const passwordValidation = validatePassword(input.password);
    if (!passwordValidation.valid) {
      throw new AppError(400, passwordValidation.errors.join(', '));
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Hashear password
    const passwordHash = await hashPassword(input.password);

    // Crear usuario con perfil
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        userType: input.userType,
        profile: {
          create: {
            name: input.name,
            location: input.location,
            companyName: input.userType === UserType.RECRUITER ? input.companyName : undefined,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Remover passwordHash de la respuesta
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verificar password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      throw new AppError(403, 'Account is deactivated');
    }

    // Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Remover passwordHash de la respuesta
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verificar refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Verificar si el token existe en la base de datos y no ha expirado
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError(401, 'Invalid or expired refresh token');
      }

      // Generar nuevo access token
      const accessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        userType: payload.userType,
      });

      return { accessToken };
    } catch (error) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Eliminar refresh token de la base de datos
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async getMe(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new AuthService();
