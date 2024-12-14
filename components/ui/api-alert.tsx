import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Copy, Server} from "lucide-react";
import {Badge, BadgeProps} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const variantMap: Record<ApiAlertProps["variant"],BadgeProps["variant"]>={
    public:"secondary",
    admin: "destructive",
}

const textMap: Record<ApiAlertProps["variant"],string>={
    public:"Public",
    admin: "Admin",
}


export const ApiAlert: React.FC<ApiAlertProps> = ({title, description, variant = "public"}) => {
    return (
        <Alert>
            <Server className='h-4 w-4'/>
            <AlertTitle className='flex items-center gap-x-2'>
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className='mt-4 flex items-center justify-between'>
                <code className='relative rounded bg-muted font-semibold font-mono text-sm px-[0.3rem] py-[0.2rem]'>
                    {description}

                </code>
                <Button variant='outline' size='icon'><Copy className='w-4 h-4'/></Button>
            </AlertDescription>
        </Alert>
    )
}