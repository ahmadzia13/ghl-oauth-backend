# OAuth Authentication Flow Demo

This repository is for references purposes for developers looking to implement GHL Oauth Authentication or use GHL APIs.

[Loom Demo](https://www.loom.com/share/61fbbc8cd0604d70ad6c1c3475bbffa4)

## Updates
- Tokens are persisted in MongoDB database for 24 hours (auto-refreshed if possible).
- Visit `/oauth/tokens` to view tokens.
- Root (`/`) redirects to `/oauth/tokens` if tokens are valid.

## Multi-Client Support

This application now supports multiple clients with different client IDs and secrets. You can register and manage multiple clients through the API or the web interface.

### Client Management API Endpoints

- `GET /clients` - Get all registered clients
- `GET /clients/:locationId` - Get a specific client by location ID
- `POST /clients` - Register a new client (for testing)
- `DELETE /clients/:locationId` - Delete a client by location ID

### Web Interface

The web interface at `http://localhost:3000` now includes:
- A dropdown to select from existing clients
- Ability to add new client credentials manually
- Automatic client list refresh

### How It Works

1. When you authenticate with a client ID and secret, the application stores these credentials in the database along with the location ID.
2. When retrieving tokens, the application uses the stored client credentials to refresh tokens if needed.
3. You can switch between different clients without having to re-authenticate if you have valid tokens for those clients.

### Testing Multi-Client Functionality

You can test the multi-client functionality using the provided test script:

```bash
node test-multi-client.js
```

This script demonstrates:
- Getting all registered clients
- Creating a new client
- Getting a specific client by location ID

### Usage with Multiple Clients

1. Visit `http://localhost:3000` in your browser
2. Select an existing client from the dropdown or enter new client credentials
3. Add the required scopes
4. Click "Authenticate"
5. Complete the OAuth flow
6. To switch clients, repeat the process with different credentials

Each client's tokens are stored separately and associated with their specific client credentials, so you won't need to re-authenticate when switching between clients that you've already authenticated with.

### Troubleshooting

If you encounter an "Invalid client credentials!" error during the OAuth flow:

1. Verify that your Client ID and Client Secret are correct
2. Ensure that your client credentials are properly registered with the OAuth provider
3. Check that your client has the necessary permissions for the requested scopes
4. If you're using test credentials, make sure they haven't expired

The error message comes from the OAuth provider and indicates that the credentials being used are not valid, rather than an issue with this application's implementation.