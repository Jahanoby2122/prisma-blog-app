import { Request, Response } from 'express';
import { postService } from './post.services';
import { Post } from '../../../generated/prisma/client';

const createPost = async (req:Request, res:Response) => {
   
    try{

        const result = await postService.createPost(req.body as Omit<Post, "id"| "createdAt"| "updatedAt">)
        res.status(201).json(result)

    }catch (error){
        console.error("Error creating post:", error)
    }
};


export const postController = {
    createPost
}