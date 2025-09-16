import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";

function LoginPage() {
  console.log(ROUTES.REGISTER);
  
  return (
    <AuthLayout
      title="Log in"
      description="Enter your email address and password to log in"
      form={<form></form>}
      footerText={
        <>
          No account? <Link to={ROUTES.REGISTER}>Sign up</Link>
        </>
      }
    />
  );
}

export const Component = LoginPage;
