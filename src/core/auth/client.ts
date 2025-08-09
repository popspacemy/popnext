import { customSessionClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { toast } from "sonner"

import type { auth } from "."

export const authClient = createAuthClient({
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message)
    },
  },
  plugins: [customSessionClient<typeof auth>()],
})
