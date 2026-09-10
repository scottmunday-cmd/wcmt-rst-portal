import Stripe from "stripe";

// Server-only Stripe client. Never import this file from a Client Component
// — STRIPE_SECRET_KEY must never reach the browser bundle.
// If the first build fails with a type error on `apiVersion`, the `stripe`
// package version resolved by npm wants a newer literal than this one —
// TypeScript's error message will name the exact string it expects; paste
// that value in here.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
