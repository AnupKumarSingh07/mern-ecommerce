// const paypal = require("paypal-rest-sdk");

// console.log("PAYPAL MODE:", process.env.PAYPAL_MODE);
// console.log("CLIENT ID:", process.env.PAYPAL_CLIENT_ID);

// paypal.configure({
//   mode: process.env.PAYPAL_MODE,
//   client_id: process.env.PAYPAL_CLIENT_ID,
//   client_secret: process.env.PAYPAL_CLIENT_SECRET,
// });

// module.exports = paypal;


const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

function environment() {
  return new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client, checkoutNodeJssdk };