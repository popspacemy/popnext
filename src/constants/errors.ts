export interface ErrorContext {
  /**
   * Params pass to the function
   */
  params?: Record<string, unknown>
  /**
   * URL params (dynamic route segments) pass to the request
   */
  requestParams?: Record<string, unknown>
  /**
   * URL query pass to the request
   */
  requestQuery?: Record<string, unknown>
  /**
   * Validated data pass to the request
   */
  requestData?: Record<string, unknown>
  /**
   * Request body pass to the request
   */
  requestBody?: Record<string, unknown>
  /**
   * Additional context pass to the request
   */
  additionalContext?: Record<string, unknown>
}

export interface ErrorDefinition {
  name: string
  code: string
  status: number
  message: string
}

export const ERROR_NAME = {
  Auth: "AUTH_ERROR",
  Validation: "VALIDATION_ERROR",
  Subscription: "SUBSCRIPTION_ERROR",
  Resource: "RESOURCE_ERROR",
  AI: "AI_ERROR",
  Stripe: "STRIPE_ERROR",
  RateLimit: "RATE_LIMIT_ERROR",
  Internal: "INTERNAL_ERROR",
  Unknown: "UNKNOWN_ERROR",
}

export const ERROR = {
  AUTH: {
    UNAUTHENTICATED: {
      name: ERROR_NAME.Auth,
      code: "AUTH_001",
      status: 401,
      message: "Authentication required",
    } satisfies ErrorDefinition,
    UNAUTHORIZED: {
      name: ERROR_NAME.Auth,
      code: "AUTH_002",
      status: 403,
      message: "Not authorized to perform this action",
    } satisfies ErrorDefinition,
  },

  VALIDATION: {
    INVALID_INPUT: {
      name: ERROR_NAME.Validation,
      code: "VAL_001",
      status: 400,
      message: "Invalid input provided",
    } satisfies ErrorDefinition,
    SCHEMA_VALIDATION: {
      name: ERROR_NAME.Validation,
      code: "VAL_002",
      status: 400,
      message: "Request payload validation failed",
    } satisfies ErrorDefinition,
  },

  SUBSCRIPTION: {
    MISSING_CREDIT_DETAILS: {
      name: ERROR_NAME.Subscription,
      code: "SUB_001",
      status: 402,
      message: "Missing credit details",
    } satisfies ErrorDefinition,
    INSUFFICIENT_CREDITS: {
      name: ERROR_NAME.Subscription,
      code: "SUB_002",
      status: 402,
      message: "Insufficient credits",
    } satisfies ErrorDefinition,
    REQUIRES_PRO: {
      name: ERROR_NAME.Subscription,
      code: "SUB_003",
      status: 402,
      message: "This feature requires a Pro subscription",
    } satisfies ErrorDefinition,
    PLAN_EXPIRED: {
      name: ERROR_NAME.Subscription,
      code: "SUB_004",
      status: 402,
      message: "Subscription plan has expired",
    } satisfies ErrorDefinition,
  },

  RESOURCE: {
    NOT_FOUND: {
      name: ERROR_NAME.Resource,
      code: "RES_001",
      status: 404,
      message: "Requested resource not found",
    } satisfies ErrorDefinition,
    CONFLICT: {
      name: ERROR_NAME.Resource,
      code: "RES_002",
      status: 409,
      message: "Resource conflict",
    } satisfies ErrorDefinition,
    NOT_ALLOWED: {
      name: ERROR_NAME.Resource,
      code: "RES_003",
      status: 404,
      message: "Requested resource not found",
    } satisfies ErrorDefinition,
  },

  AI: {
    GENERATION_FAILED: {
      name: ERROR_NAME.AI,
      code: "AI_001",
      status: 500,
      message: "AI generation failed",
    } satisfies ErrorDefinition,
    INVALID_PROMPT: {
      name: ERROR_NAME.AI,
      code: "AI_002",
      status: 400,
      message: "Invalid AI prompt parameters",
    } satisfies ErrorDefinition,
    MODEL_UNAVAILABLE: {
      name: ERROR_NAME.AI,
      code: "AI_003",
      status: 503,
      message: "AI model temporarily unavailable",
    } satisfies ErrorDefinition,
    TOOL_UNAVAILABLE: {
      name: ERROR_NAME.AI,
      code: "AI_004",
      status: 503,
      message: "AI tool temporarily unavailable",
    } satisfies ErrorDefinition,
  },

  STRIPE: {
    WEBHOOK_SIGNATURE: {
      name: ERROR_NAME.Stripe,
      code: "STR_001",
      status: 400,
      message: "Invalid Stripe webhook signature",
    } satisfies ErrorDefinition,
    PAYMENT_FAILED: {
      name: ERROR_NAME.Stripe,
      code: "STR_002",
      status: 402,
      message: "Payment processing failed",
    } satisfies ErrorDefinition,
    WEBHOOK_ERROR: {
      name: ERROR_NAME.Stripe,
      code: "STR_003",
      status: 500,
      message: "Stripe webhook processing error",
    } satisfies ErrorDefinition,
  },

  RATE_LIMIT: {
    TOO_MANY_REQUESTS: {
      name: ERROR_NAME.RateLimit,
      code: "RAT_001",
      status: 429,
      message: "Too many requests",
    } satisfies ErrorDefinition,
  },

  INTERNAL: {
    DB_ERROR: {
      name: ERROR_NAME.Internal,
      code: "INT_001",
      status: 500,
      message: "Database operation failed",
    } satisfies ErrorDefinition,
    CACHE_ERROR: {
      name: ERROR_NAME.Internal,
      code: "INT_002",
      status: 500,
      message: "Cache operation failed",
    } satisfies ErrorDefinition,
    UNEXPECTED: {
      name: ERROR_NAME.Internal,
      code: "INT_003",
      status: 500,
      message: "An unexpected error occurred",
    } satisfies ErrorDefinition,
    EMAIL_ERROR: {
      name: ERROR_NAME.Internal,
      code: "INT_004",
      status: 500,
      message: "Email sending failed",
    } satisfies ErrorDefinition,
    UNHANDLED: {
      name: ERROR_NAME.Internal,
      code: "INT_005",
      status: 500,
      message: "An unexpected error occurred",
    } satisfies ErrorDefinition,
  },
} as const

export type ErrorCode =
  (typeof ERROR)[keyof typeof ERROR][keyof (typeof ERROR)[keyof typeof ERROR]]["code"]
