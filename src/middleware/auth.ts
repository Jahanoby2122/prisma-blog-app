import { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from "../lib/auth"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
                
            }
        }
    }
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}


const auth = (...roles: UserRole[])=>{
   return async (req: Request, res: Response, next: NextFunction)=>{
    //    get user session
    try{
        
    const session = await betterAuth.api.getSession({
        headers: req.headers as any
    })

    if(!session || !session.user){
        return res.status(401).json({message: "Unauthorized"})
    }
    if(!session.user.emailVerified){
        return res.status(403).json({message: "Email not verified"})

    }


    req.user ={
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified
    }

    if(roles.length &&!roles.includes(req.user.role as UserRole)){

        return res.status(403).json({message: "Forbidden you dont have the required role to access this resource"})
    }




    // console.log("Session:", session)
    next()


    }catch(error){
        console.error("Error in auth middleware:", error)
    }
    }
}

export default auth


