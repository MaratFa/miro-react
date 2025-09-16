import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";

function RegisterPage() {
  return (
    <AuthLayout
      title="Sign up"
      description="Enter your email address and password to log in"
      form={<form></form>}
      footerText={
        <>
          Do you have an account? <Link to={ROUTES.LOGIN}>Log in</Link>
        </>
      }
    />
  );
}

export const Component = RegisterPage;
