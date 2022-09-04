import fastify from "fastify"
import crypto from "crypto"

// import json schemas as normal
import PostSchema from "./schemas/post.json"
import PostRequestSchema from "./schemas/postRequest.json"

// import the generated interfaces
import { PostSchema as PostSchemaType } from "./types/post"
import { PostRequestSchema as PostRequestSchemaInterface } from "./types/postRequest"

const server = fastify()

server.route({
	method: "GET",
	url: "/post",
	schema: {
		response: {
			200: {
				type: "array",
				items: PostSchema,
			},
		},
	},
	handler: (request, reply) => {
		//todo:DB
		const response: PostSchemaType = {} as PostSchemaType
		reply.status(200).send(response)
	},
})

server.route<{
	Body: PostRequestSchemaInterface
}>({
	method: "POST",
	url: "/post",
	schema: {
		body: PostRequestSchema,
		response: {
			200: {
				type: "object",
				item: PostSchema,
			},
		},
	},
	handler: (request, reply) => {
		const response: PostSchemaType = {
			name: request.body.name,
			content: request.body.content,
			hashedPassword: "",
		}
		if (request.body.password) {
			response.hashedPassword = crypto
				.createHash("sha256")
				.update(request.body.password)
				.digest("hex")
		}
		//todo:DB
		reply.status(200).send(response)
	},
})

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(0)
	}
	console.log(`Server listening at ${address}`)
})
