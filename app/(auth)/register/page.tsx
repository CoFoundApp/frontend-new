import RegisterForm from "@/components/application/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="flex flex-col gap-6 max-w-sm">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Bienvenue sur CoFound</CardTitle>
                    <CardDescription>
                        Inscrivez-vous avec votre compte Google
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                En cliquant sur « Continuer », vous acceptez nos <a href="#">Conditions d'utilisation</a>{" "}
                et notre <a href="#">Politique de confidentialité</a>.
            </div>
        </div>
    );
}