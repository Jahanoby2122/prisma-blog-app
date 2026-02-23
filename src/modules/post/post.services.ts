import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id"| "createdAt"| "updatedAt"| "AuthorId">, userId: string)=>{
    const result = await prisma.post.create({
        data: {
            ...data,
            AuthorId: userId
        }


    })

    return result

}

const getAllPosts = async (payload: {search?: string })=>{
    
    const result = await prisma.post.findMany({
        where:{

            title: {
                contains: payload.search as string,
                mode: "insensitive"
            }
       
        }
    })

    return result

    
}

export const postService = {
    createPost,
    getAllPosts
}