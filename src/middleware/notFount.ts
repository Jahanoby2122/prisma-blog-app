import { Request, Response } from "express";

export const notFount = async(req: Request, res: Response)=>{
    res.status(404).json({
        message: "The requested route was not found on this server."
    })

}