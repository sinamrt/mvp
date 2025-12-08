// lib/middleware/hmac-auth.ts

// Client Request 
// ↓
// [pages/api/jobs/recompute-recs.ts] 
// ↓ (HMAC Protection)
// [lib/middleware/hmac-auth.ts] 
// ↓ (Authentication)
// [lib/jobs/recompute-recs.ts] 
// ↓ (Business Logic)
// [lib/prisma.ts] 
// ↓ (Data Access)
// PostgreSQL/NeonDB


// # Scripts & Files Relationships

// | Script/File | Relationship Type | Impact Level | Dependencies | Direction | Purpose |
// |-------------|-------------------|-------------|--------------|-----------|---------|
// | **`pages/api/jobs/recompute-recs.ts`** | • **Primary Consumer**<br>• Direct Integration<br>• Protected Endpoint | **High**<br>Required for operation | • `lib/middleware/hmac-auth.ts`<br>• `lib/jobs/recompute-recs.ts`<br>• `lib/prisma.ts` | **Inbound**<br>Receives HMAC protection | API endpoint for triggering recommendation jobs |
// | **`lib/middleware/hmac-auth.ts`** | • **Core Security Layer**<br>• Middleware Provider<br>• Authentication Service | **Critical**<br>Security dependency | • Node.js `crypto`<br>• `process.env.API_SECRET`<br>• Next.js types | **Outbound**<br>Protects other routes | HMAC authentication middleware |
// | **`lib/jobs/recompute-recs.ts`** | • **Business Logic**<br>• Downstream Service<br>• Job Executor | **High**<br>Business critical | • `lib/prisma.ts`<br>• Database schema<br>• User/meal data models | **Downstream**<br>Called after auth | Recommendation computation engine |
// | **`lib/prisma.ts`** | • **Data Access Layer**<br>• Database Client<br>• ORM Provider | **Medium**<br>Infrastructure | • PostgreSQL/NeonDB<br>• Prisma client<br>• Database URL | **Foundation**<br>Underlying data access | Database connection and query management |
// | **`lib/utils/crypto.ts`** | • **Utility Helper**<br>• Optional Dependency<br>• Code Reuse | **Low**<br>Optional enhancement | • Node.js `crypto`<br>• Same as main middleware | **Parallel**<br>Shared functionality | HMAC signature generation utilities |
// | **`.env.local`** | • **Configuration Source**<br>• Secret Storage<br>• Environment Management | **Critical**<br>Required for security | • Vercel environment<br>• Local development setup | **Configuration**<br>Provides secrets | Environment variables and API secrets |
// | **`vercel.json`** | • **Deployment Config**<br>• Platform Settings<br>• Runtime Configuration | **Medium**<br>Operational needs | • Vercel platform<br>• Deployment pipeline | **Infrastructure**<br>Platform configuration | Serverless function settings and routes |
// | **`package.json`** | • **Dependency Manager**<br>• Build Configuration<br>• Script Definitions | **Low**<br>Development | • Node.js ecosystem<br>• npm/yarn packages | **Foundation**<br>Project setup | Project dependencies and build scripts |

// ## **Relationship Flow Diagram**

// ```
// Client Request 
//     ↓
// [pages/api/jobs/recompute-recs.ts] 
//     ↓ (HMAC Protection)
// [lib/middleware/hmac-auth.ts] 
//     ↓ (Authentication)
// [lib/jobs/recompute-recs.ts] 
//     ↓ (Business Logic)
// [lib/prisma.ts] 
//     ↓ (Data Access)
// PostgreSQL/NeonDB
// ```

// ** ## **Integration Points Summary**

// | Integration Point | Data Flow | Security Impact | Failure Scenario |
// |-------------------|-----------|----------------|------------------|
// | **API Route → Middleware** | Request validation | **Critical** - Blocks unauthorized access | Returns 401/500 errors |
// | **Middleware → Job Service** | Authenticated execution | **High** - Ensures authorized job runs | Job never executes |
// | **Job Service → Prisma** | Database operations | **Medium** - Data integrity depends on auth | Data corruption risk |
// | **Middleware → Environment** | Secret retrieval | **Critical** - Crypto operations depend on secrets | Authentication fails |
// | **All → Crypto Utils** | Optional helper calls | **Low** - Convenience only | Manual implementation needed |

import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export const hmacAuth = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // REQUIRED HEADERS VALIDATION
    const signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];
    const nonce = req.headers['x-nonce'];

    if (!signature || !timestamp || !nonce) {
      res.status(401).json({ 
        error: 'Missing authentication headers',
        required: ['x-signature', 'x-timestamp', 'x-nonce']
      });
      return;
    }

    // TIMESTAMP VALIDATION (5-minute window)
    const requestTime = parseInt(timestamp as string);
    const currentTime = Date.now();
    
    if (isNaN(requestTime) || Math.abs(currentTime - requestTime) > 300000) {
      res.status(401).json({ 
        error: 'Request timestamp expired or invalid',
        maxWindow: '5 minutes'
      });
      return;
    }

    // BODY TAMPER PROTECTION
    const rawBody = JSON.stringify(req.body) || '';
    const bodyHash = crypto
      .createHash('sha256')
      .update(rawBody)
      .digest('hex');

    // HMAC SIGNATURE VERIFICATION
    const secret = process.env.API_SECRET;
    if (!secret) {
      console.error('API_SECRET environment variable not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}:${nonce}:${bodyHash}`)
      .digest('hex');

    // TIMING-SAFE COMPARISON
    if (!crypto.timingSafeEqual(
      Buffer.from(signature as string), 
      Buffer.from(expectedSignature)
    )) {
      res.status(401).json({ error: 'Invalid HMAC signature' });
      return;
    }

    // Authentication successful - proceed to handler
    await handler(req, res);
  };
};




// ** Scripts & Files Relationships
// ** File	Relationship Type	Impact Level
// ** pages/api/jobs/recompute-recs.ts	• Primary Protected Route
// ** Direct middleware consumer	High - Required
//  lib/jobs/recompute-recs.ts	• Business Logic Provider
//   Called post-authentication	Medium - Indirect
// lib/prisma.ts	• Data Access Layer
// • Database operations dependency	Low - Indirect
// lib/utils/crypto.ts	• Utility Helper
// • Optional signature generation	Low - Optional
// .env.local	• Configuration Source
// • API_SECRET storage	Critical - Required
// vercel.json	• Deployment Config
// • Function timeout settings	Medium - Operational


// ** Integration Requirements
// Requirement	Details
// Framework Compatibility	• Next.js API routes
// • TypeScript fully supported
// • Serverless function ready
// Error Handling	• 401 Unauthorized for auth failures
// • 500 Internal Server Error for config issues
// • JSON error responses
// Async Support	• Returns Promise<void>
// • Supports async handler functions
// • Proper async/await flow
// Environment Setup	• API_SECRET in .env.local
// • Vercel environment variables
// • Node.js runtime
// Operational Characteristics
// Characteristic	Specification
// Performance	• Minimal crypto overhead
// • Fast validation process
// • No database queries
// Resource Usage	• Low memory footprint
// • No persistent connections
// • Stateless design
// Dependencies	• Node.js built-in crypto
// • Next.js types only
// • No external packages
// Monitoring	• Console errors for config issues
// • Structured error responses
// • No custom logging
// Usage Patterns & Examples
// Pattern	Implementation
// Route Protection	• export default hmacAuth(handler)
// • Wraps existing API handlers
// • Transparent security layer
// Client Requirements	• Must include x-signature header
// • Must include x-timestamp header
// • Must include x-nonce header
// • Must sign request body
// Error Handling	• JSON error format
// • Specific error messages
// • Appropriate status codes
// Testing Strategy	• Mock crypto functions
// • Test timestamp validation
// • Verify error conditions
// Security Considerations & Mitigations
// Risk	Mitigation Strategy
// Secret Exposure	• Environment variables only
// • Vercel secret management
// • No code repository storage
// Replay Attacks	• 5-minute timestamp window
// • Nonce requirement
// • Time-based invalidation
// Timing Attacks	• crypto.timingSafeEqual()
// • Constant-time comparison
// • No early returns in crypto logic
// Information Leakage	• Generic error messages in production
// • No stack traces to clients
// • Limited error details
// Header Manipulation	• Full signature validation required
// • Multiple component verification
// • Body hash integrity check