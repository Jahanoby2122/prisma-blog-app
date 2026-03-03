import { Request, Response } from "express";
import { CommentServices } from "./comment.services";
import { prisma } from "../../lib/prisma";

const createComment = async (req: Request , res: Response)=>{
    try {
      const user = req.user
    req.body.AuthorId = user?.id
        const result = await CommentServices.createComment(req.body)
        res.status(201).json(result)

    }catch(error){
        res.status(400).json({
            error: "Comment creation failed",
            details: error
        })
    }

}
const getCommentById = async (req: Request , res: Response)=>{
    try {
      const user = req.user
    req.body.AuthorId = user?.id
        const result = await CommentServices.createComment(req.body)
        res.status(201).json(result)

    }catch(error){
        res.status(400).json({
            error: "Comment creation failed",
            details: error
        })
    }

}


export const commentController = {
    createComment,
    getCommentById
}