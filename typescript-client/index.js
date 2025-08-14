// Import the MCP SDK client and transport
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import 'dotenv/config';

// ============================================================================
// MCP CLIENT SETUP AND CONFIGURATION
// ============================================================================

// Define the MCP server endpoint
const baseUrl = new URL('https://api-v2.swytchcode.com/v2/mcp/mcp');

// Configure authentication headers
const customHeaders = {
  "Authorization": process.env.MCP_KEY
};
const requestInit = { headers: customHeaders };

// Create the MCP client with your application details
const client = new Client({
  name: 'swytchcode-mcp-client',
  version: '2.0.0'
});

// Create the transport layer for HTTP communication with the MCP server
const transport = new StreamableHTTPClientTransport(
  new URL(baseUrl),
  {
    requestInit: requestInit
  }
);

// ============================================================================
// CONNECT TO MCP SERVER
// ============================================================================

// Establish connection to the MCP server
await client.connect(transport);
console.log("✅ Connected to MCP server successfully");

// ============================================================================
// DISCOVER AVAILABLE CAPABILITIES
// ============================================================================

// List all available tools (functions that can be called)
const tools = await client.listTools();
console.log("🔧 Available MCP Tools:", tools);

// List all available resources (data that can be accessed)
const resources = await client.listResources();
console.log("📚 Available MCP Resources:", resources);

// List all available resource templates (predefined resource patterns)
const templates = await client.listResourceTemplates();
console.log("📋 Available MCP Resource Templates:", templates);

// ============================================================================
// READ A SPECIFIC RESOURCE
// ============================================================================

// Read a specific library
const libraries = await client.readResource({
  uri: `data://libraries`,
});
console.log("📖 Retrieved Libraries:", libraries);

// Read methods for a library
// library_uuid can be obtained from the libraries resource
const methods = await client.readResource({
  uri: `data://methods?library_uuid=9c271749-af92-4c1d-95ac-a1cf10d8d322`,
});
console.log("📖 Retrieved Methods:", methods);

// Read workflows for a library
// library_uuid can be obtained from the libraries resource
const workflows = await client.readResource({
  uri: `data://workflows?library_uuid=9c271749-af92-4c1d-95ac-a1cf10d8d322`,
});
console.log("📖 Retrieved workflows:", workflows);

// ============================================================================
// CALL A TOOL (EXECUTE A FUNCTION)
// ============================================================================

// Execute a tool with specific arguments
// Session id is a unique identifier for the session. You can pass a string
const callTool = await client.callTool({
  name: 'custom-code',
  arguments: {
    session_id: 'session-1',
    prompt: 'Retrieve unsettled balance via POST request',
    language: 'python',
    library_uuid: '9c271749-af92-4c1d-95ac-a1cf10d8d322'
  }
});
console.log("⚡ Tool Execution Result:", callTool);

// ============================================================================
// CLEANUP AND DISCONNECTION
// ============================================================================

// Properly close the connection to the MCP server
await client.close();
console.log("🔌 Disconnected from MCP server");