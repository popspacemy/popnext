// import { $, Seed, users } from "@better-auth-kit/seed"

// /**
//  * This doesn't work. Need to be fixed in the future when better-auth-kit is more stable
//  */
// export const seed = Seed({
//   ...users({
//     user: {
//       email: $.email({ fullname: () => $.first_and_lastname(() => "test"), domain: "test.com" }),
//     },
//     account: {
//       password: $.password(() => "admin123"),
//     },
//   }),
// })
