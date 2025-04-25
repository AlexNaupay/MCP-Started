import {McpServer, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
    name: "Demo",
    version: "1.0.0",

});

// Add an addition tool
server.tool(
    "add",
    "Adds two numbers together",
    {
        a: z.number(),
        b: z.number()
    },
    async ({a, b}) => ({
        content: [{type: "text", text: String(a + b)}]
    })
);

server.tool(
    'norris-jokes',
    'Proporciona chistes y hechos humorísticos relacionados con Chuck Norris, el famoso actor y artista marcial',
    async () => {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const data = await response.json();
    return {
        content: [{type: "text", text: data.value}]
    }
})


// Add a dynamic greeting resource
server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", {list: undefined}),
    async (uri, {name}) => ({
        contents: [{
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
    })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);