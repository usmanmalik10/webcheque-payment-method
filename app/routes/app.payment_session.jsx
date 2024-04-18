import { createPaymentSession } from "~/payments.repository";

/**
 * Saves and starts a payment session.
 * Redirects back to shop if payment session was created.
 */
export const action = async ({ request }) => {
  const requestBody = await request.json();
  // console.log("Request Body:", requestBody); // Log request body to inspect its contents

  const shopDomain = request.headers.get("shopify-shop-domain");

  // return { shopDomain, requestBody };

  const paymentSession = await createPaymentSession(
    createParams(requestBody, shopDomain)
  );
  // console.log("🚀 ~ action ~ paymentSession:", paymentSession.id);

  if (!paymentSession)
    throw new Response("A PaymentSession couldn't be created.", {
      status: 500,
    });

  return { redirect_url: buildRedirectUrl(request, paymentSession.id) };
};
const createParams = (
  {
    id,
    gid,
    group,
    amount,
    currency,
    test,
    kind,
    customer,
    payment_method,
    proposed_at,
  },
  shopDomain
) => {
  // console.log("cancel_url:", payment_method.data.cancel_url); // Log cancel_url to verify its presence
  return {
    id,
    gid,
    group,
    amount,
    currency,
    test,
    kind,
    customer,
    paymentMethod: payment_method,
    proposedAt: proposed_at,
    cancelUrl: payment_method.data.cancel_url, // Access cancel_url from payment_method.data
    shop: shopDomain,
  };
};

// const createParams = (
//   {
//     id,
//     gid,
//     group,
//     amount,
//     currency,
//     test,
//     kind,
//     customer,
//     payment_method,
//     proposed_at,
//     cancel_url,
//   },
//   shopDomain
// ) => (
//   {

//   id,
//   gid,
//   group,
//   amount,
//   currency,
//   test,
//   kind,
//   customer,
//   paymentMethod: payment_method,
//   proposedAt: proposed_at,
//   cancelUrl: cancel_url,
//   shop: shopDomain,
// });

const buildRedirectUrl = (request, id) => {
  return `${request.url.slice(
    0,
    request.url.lastIndexOf("/")
  )}/payment_simulator/${id}`;
};
