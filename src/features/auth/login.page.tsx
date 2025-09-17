import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import { LoginForm } from "./login-form";

function LoginPage() {
  
  return (
    <AuthLayout
      title="Log in"
      description="Enter your email address and password to log in"
      form={<LoginForm />}
      footerText={
        <>
          No account? <Link to={ROUTES.REGISTER}>Sign up</Link>
        </>
      }
    />
  );
}

export const Component = LoginPage;
