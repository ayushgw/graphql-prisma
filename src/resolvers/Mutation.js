const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        return prisma.mutation.createUser({ data: args.data }, info)
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