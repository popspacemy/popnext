import { $, Seed, users } from "@better-auth-kit/seed"

export const seed = Seed({
  ...users({
    user: {
      email: $.email({ fullname: () => $.first_and_lastname(() => "test"), domain: "test.com" }),
    },
    account: {
      password: $.password(() => "admin123"),
    },
  }),
})
