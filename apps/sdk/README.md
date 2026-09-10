# Poscally NodeJS SDK

This is the NodeJS SDK for [Poscally](https://poscally.com).

You can start by installing the package:

```bash
npm install @poscally/node
```

## Usage
```typescript
import Poscally from '@poscally/node';
const poscally = new Poscally('your api key', 'your self-hosted instance (optional)');
```

The available methods are:
- `post(posts: CreatePostDto)` - Schedule a post to Poscally
- `postList(filters: GetPostsDto)` - Get a list of posts
- `upload(file: Buffer, extension: string)` - Upload a file to Poscally
- `integrations()` - Get a list of connected channels
- `deletePost(id: string)` - Delete a post by ID

Alternatively you can use the SDK with curl, check the [Poscally API documentation](https://docs.poscally.com/public-api) for more information.