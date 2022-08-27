import faker from 'faker'

import { GraphQLClient } from 'graphql-request'

import main from '../src/main'
import logger from '../src/logger'

describe('Comments API Testing', () => {
  let server, publisher, subscriber, post, loggedInUser

  const client = new GraphQLClient(`http://localhost:${process.env.GRAPHQL_PORT}/`, {
    credentials: 'include'
  })

  beforeAll(async () => {
    logger.info('====COMMENTS API SETUP===')

    const start = await main()

    server = start.httpServer
    publisher = start.publisher
    subscriber = start.subscriber

    const userData = {
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }

    await client.request(`
      mutation {
        signup(
          data: {
            name: "${userData.name}",
            email: "${userData.email}",
            password: "${userData.password}",
            age: ${userData.age}
          }
        ) {
          user {
            id
            name
            email
            age
            createdAt
            updatedAt
            version
          }
          errors {
            field
            message
          }
        }
      }`)

    const loginResponse = await client.request(`
      mutation {
        login(
          data: {
            email: "${userData.email}",
            password: "${userData.password}"
          }
        ) {
          user {
            id
            name
            email
            age
            createdAt
            updatedAt
            version
          }
          errors {
            field
            message
          }
        }
      }`)

    loggedInUser = loginResponse.login.user

    const postData = {
      title: faker.random.words(),
      body: faker.lorem.sentence()
    }

    const createPostResponse = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${postData.title}",
            body: "${postData.body}",
            published: true
          }
        ) {
          errors {
            field
            message
          }
          post {
            id
          }
        }
      }
    `)

    post = createPostResponse.createPost.post
  })

  afterAll(async () => {
    publisher.disconnect()
    subscriber.disconnect()
    server.close()
  })

  it('should create a comment', async () => {
    const text = faker.lorem.sentence()

    const response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
            author {
              id
            }
            post {
              id
            }
          }
        }
      }
    `)

    const result = response.createComment

    // Stucture check/s
    expect(result.comment).toContainAllKeys(['id', 'text', 'createdAt', 'updatedAt', 'version', 'author', 'post'])

    // Type check/s
    expect(result.comment.id).toBeString()
    expect(result.comment.text).toBeString()
    expect(result.comment.createdAt).toBeString()
    expect(result.comment.updatedAt).toBeString()
    expect(result.comment.version).toBeNumber()
    expect(result.comment.author).toBeObject()
    expect(result.comment.post).toBeObject()

    // Value check/s
    expect(result.comment.text).toBe(text)
    expect(result.comment.post.id).toBe(post.id)
    expect(result.comment.author.id).toBe(loggedInUser.id)

    return true
  })

  it('should update a comment', async () => {
    let text = faker.lorem.sentence()

    let response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
          }
        }
      }
    `)

    expect(response.createComment).not.toBeNil()
    expect(response.createComment.comment).not.toBeNil()

    text = faker.lorem.sentence()

    response = await client.request(`
      mutation updateComment {
        updateComment(
          id: "${response.createComment.comment.id}"
          data: { text: "${text}" }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
          }
        }
      }
    `)

    const result = response.updateComment

    expect(result).not.toBeNil()
    expect(result.comment).not.toBeNil()

    // Stucture check/s
    expect(result.comment).toContainAllKeys(['id', 'text', 'createdAt', 'updatedAt', 'version'])

    // Type check/s
    expect(result.comment.id).toBeString()
    expect(result.comment.text).toBeString()
    expect(result.comment.createdAt).toBeString()
    expect(result.comment.updatedAt).toBeString()
    expect(result.comment.version).toBeNumber()

    // Value check/s
    expect(result.comment.text).toBe(text)

    return true
  })

  it('should return a collection of comments', async () => {
    const { comments } = await client.request(`
      query findAllComments {
        comments {
          edges {
            node {
              id
              text
              createdAt
              updatedAt
              version
            }
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `)

    expect(comments).not.toBeNil()
    expect(comments.edges).not.toBeNil()
    expect(comments.pageInfo).not.toBeNil()

    expect(comments.edges).toBeArray()
    expect(comments.pageInfo).toBeObject()

    // Stucture check/s
    expect(comments.edges[0]).toContainAllKeys(['node', 'cursor'])
    expect(comments.pageInfo).toContainAllKeys(['startCursor', 'endCursor', 'hasNextPage', 'hasPreviousPage'])
    expect(comments.edges[0].node).toContainAllKeys(['id', 'text', 'createdAt', 'updatedAt', 'version'])

    // Type check/s
    expect(comments.edges[0].node.id).toBeString()
    expect(comments.edges[0].node.text).toBeString()
    expect(comments.edges[0].node.createdAt).toBeString()
    expect(comments.edges[0].node.updatedAt).toBeString()
    expect(comments.edges[0].node.version).toBeNumber()

    return true
  })

  it('should return the number of comments in the database', async () => {
    const response = await client.request(`
      query commentCount {
        commentCount
      }
    `)

    const result = response.commentCount

    expect(result).not.toBeNil()

    // Type check/s
    expect(result).toBeNumber()

    // Value check/s
    expect(result).toSatisfy((count) => count > 0)

    return true
  })

  it('should delete a comment by id', async () => {
    const text = faker.lorem.sentence()

    const response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
          }
        }
      }
    `)

    const result = response.createComment
    const { id } = result.comment

    expect(result).not.toBeNil()
    expect(result.comment).not.toBeNil()

    const deleteResponse = await client.request(`
      mutation deleteComment {
        deleteComment(id: "${id}") {
          errors {
            field
            message
          }
          count
        }
      }
    `)

    expect(deleteResponse.deleteComment).not.toBeNil()

    // Type check/s
    expect(deleteResponse.deleteComment.count).toBeNumber()

    // Value check/s
    expect(deleteResponse.deleteComment.count).toSatisfy((count) => count === 1)

    return true
  })
})
