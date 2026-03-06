import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: {
    content: string,
    PostId: string,
    AuthorId: string,
    ParentId?: string
})=>{
   
    try{

        await prisma.post.findUnique({
            where: {
                id: payload.PostId
            }
        })

        if (payload.ParentId){
             await prisma.comment.findUniqueOrThrow({
                where: {
                    id: payload.ParentId
                }
            })
            
        }


        const result = await prisma.comment.create({
            data: payload
        })

        return result

    }catch(error){
        console.error("Create Comment Error:", error)
    throw new Error("Failed to create comment")
        
    }
}


const getCommentById = async (commentId: string)=>{
    
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
    return result
}


const getCommentByAuthorId = async (AuthorId: string)=>{
    const result = await prisma.comment.findMany({
        where: {
            AuthorId: AuthorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return result

}


// 1. nijar comment delete korta parbe
// login thakte hobe
// tar nijar comment kina ata check korta hobe

const deleteComment = async (commentId: string , AuthorId: string)=>{
   await prisma.comment.findFirst({
        where: {
            id: commentId,
            AuthorId
        }
    })



    return await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
}

// authorId, commentId, updatedData

// authorId, commentId, updatedData
const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            AuthorId: authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
             AuthorId: authorId
        },
        data
    })
}


const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });

    if (commentData.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date.`)
    }

    return await prisma.comment.update({
        where: {
            id
        },
        data
    })
}

export const CommentServices = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
   
  
    

}