import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: 'graphqlcoursesupersecretkey'
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })

//     if(!userExists) {
//         throw new Error('User not found!')
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title body published } } }')

//     return post.author
// }

// createPostForUser('ck0ikm0jk007u0739kiei298a', {
//     title: 'Books',
//     body: 'Very informative books',
//     published: true
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
// }).catch(error => {
//     console.log(error.message);
// })

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({
//         id: postId
//     })

//     if(!postExists) {
//         throw new Error('Post not found!')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { id name email posts { id title body published } } }')

//     return post.author
// }

// updatePostForUser('ck0nyr12a02bz07390xmfa0ls', {
//     title: "Changed title",
//     body: "Changed Body"
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 4));
// }).catch(error => {
//     console.log(error.message);
// })