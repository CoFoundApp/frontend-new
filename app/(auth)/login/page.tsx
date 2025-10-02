import LoginForm from "@/components/application/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Content de te revoir</CardTitle>
                    <CardDescription>
                        Connectez-vous avec votre compte Google
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                En cliquant sur « Continuer », vous acceptez nos <a href="#">Conditions d'utilisation</a>{" "}
                et notre <a href="#">Politique de confidentialité</a>.
            </div>
        </div>
    );
}