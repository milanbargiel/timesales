// This configuration is used if production environment is explicitly set with
// NODE_ENV=production npm run build
// NODE_ENV=production npm start

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'https://xyz.timesales.ltd',
  stripePrivateKey: env('STRIPE_PRIVATE_KEY'),
  stripeEndpointSecret: env('STRIPE_ENDPOINT_SECRET'),
  stripeTaxRateId: env('STRIPE_TAX_RATE_ID'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
});
