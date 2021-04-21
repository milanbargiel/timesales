module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://localhost:1337',
  stripePrivateKey: env('STRIPE_PRIVATE_KEY'),
  stripeEndpointSecret: env('STRIPE_ENDPOINT_SECRET'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '61862e3e067c515d62fbb8698852447e'),
    },
  },
});
