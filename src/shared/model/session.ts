import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createStore } from "create-gstore";

type Session = {
  userId: string;
  email: string;
  exp: number;
  iat: number;
};

const TOKEN_KEY = "token";

export const useSession = () => {













  
}

