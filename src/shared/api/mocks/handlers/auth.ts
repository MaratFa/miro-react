import type { ApiSchemas } from "../../schema";
import { http } from "../http";
import { delay, HttpResponse } from "msw";
import { createRefreshTokenCookie, generateTokens } from "../session";

const mockUsers: ApiSchemas["User"][] = [
  {
    id: "1",
    email: "admin@gmail.com",
  },
];

const userPasswords = new Map<string, string>();
userPasswords.set("admin@gmail.com", "123456");

const mockTokens = new Map<string, string>();

export const authHandlers = [
  http.post("/auth/login", async ({ request }) => {
    const body = await request.json();

    const user = mockUsers.find((u) => u.email === body.email);
    const storedPassword = userPasswords.get(body.email);

    await delay();

    if (!user || !storedPassword || storedPassword !== body.password) {
      return HttpResponse.json(
        {
          message: "Неверный email или пароль",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    
    const { accessToken, refreshToken } = await generateTokens({
      userId: user.id,
      email: user.email,
    });
    return HttpResponse.json(
      {
        accessToken: accessToken,
        user,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": createRefreshTokenCookie(refreshToken),
        },
      }
    );
  }),
  
  http.post("/auth/register", async ({ request }) => {
    const body = await request.json();

    await delay();

    if (mockUsers.some((u) => u.email === body.email)) {
      return HttpResponse.json(
        {
          message: "Пользователь уже существует",
          code: "USER_EXISTS",
        },
        { status: 400 }
      );
    }


    const newUser: ApiSchemas["User"] = {
      id: String(mockUsers.length + 1),
      email: body.email,
    };











    
    mockUsers.push(newUser);
    userPasswords.set(body.email, body.password);

    return HttpResponse.json(
      {
        accessToken: token,
        user: newUser,
      },
      { status: 201 }
    );
  }),
];
