import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/kit/card";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";

function LoginPage() {
  return (
    <AuthLayout>









    </AuthLayout>




    // <main className="grow flex flex-col pt-[200px] items-center">
    //   <Card className="w-full max-w-[400px]">
    //     <CardHeader>
    //       <CardTitle>Log in</CardTitle>
    //       <CardDescription>
    //         Enter your email address and password to log in
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent></CardContent>
    //     <CardFooter>
    //       <p className="text-sm text-muted-foreground">
    //         No account?{" "}
    //         <Button asChild variant={'link'}>
    //           <Link className="underline text-primary" to={ROUTES.REGISTER}>Sign up</Link>
    //         </Button>
    //       </p>
    //     </CardFooter>
    //   </Card>
    // </main>
  );
}

export const Component = LoginPage;
