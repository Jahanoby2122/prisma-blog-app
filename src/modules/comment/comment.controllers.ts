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
      
        const {commentId} = req.params
        const result = await CommentServices.getCommentById(commentId as string)
        res.status(201).json(result)

    }catch(error){
        res.status(400).json({
            error: "Comment creation failed",
            details: error
        })
    }

}

const getCommentByAuthorId = async (req: Request , res: Response)=>{
    try{
        const {AuthorId} = req.params
        const result = await CommentServices.getCommentByAuthorId(AuthorId as string)
        res.status(201).json(result)

    }catch(error){
        res.status(400).json({
            error: "Failed to fetch comments by author",
            details: error
        })
    }
}


const deleteComment = async(req: Request , res: Response)=>{
    try{
        const {commentId} = req.params
        const user = req.user
        const result = await CommentServices.deleteComment(commentId as string , user?.id as string)
        res.status(200).json(result)
    }catch(error){
        res.status(400).json({
            error: "Failed to delete comment",
            details: error
        })
    }
}
const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await CommentServices.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment update failed!",
            details: e
        })
    }
}




const moderateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await CommentServices.moderateComment(commentId as string, req.body)
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Comment update failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}


export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
}