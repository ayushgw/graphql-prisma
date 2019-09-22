import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer!')
        }

        const password = await bcrypt.hash(args.data.password, 10)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        const token = jwt.sign({ userId: user.id }, 'myjwtsecret')

        return {
            user,
            token
        }
    },
    async loginUser(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if(!user) {
            throw new Error('Unable to login!')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if(!isMatch) {
            throw new Error('Unable to login!')
        }

        const token = jwt.sign({ userId: user.id }, 'myjwtsecret')

        return {
            user,
            token
        }
    },
    async deleteUser(parent, args, { prisma }, info) {
        return await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },
    updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma }, info) {
        return prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info)
    },
    deletePost(parent, args, { prisma }, info) {
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    updatePost(parent, args, { prisma }, info) {
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createComment(parent, args, { prisma }, info) {
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    updateComment(parent, args, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }