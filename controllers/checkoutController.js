require("dotenv").config();
const Stripe = require("stripe");

const checkoutPost = async (req, res) => {
  try {
    const stripe = await new Stripe(process.env.KEY);
    /*   const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: "once",
    }); */

    /*   const promotionCode = await stripe.promotionCodes.create({
      coupon: [{ id: "promo_1NfzP4L0Q8YfFPiqro3YsCFk" }],
      code: "PRUEBA30",
    }); */

    const items = req.body.items;
    console.log(items);

    let lineItems = [];
    items.forEach((item) => {
      lineItems.push({ price: item.idStripe, quantity: item.quantity });
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["AU"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1NgGnLL0Q8YfFPiqOT8pOjcF",
        },
        {
          shipping_rate: "shr_1NgGmoL0Q8YfFPiqmw4IZnht",
        },
        {
          shipping_rate: "shr_1NgGlZL0Q8YfFPiq6KssTHnX",
        },
      ],
      /*     discounts: [
        {
          coupon: promotionCode,
        },
      ], */
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      line_items: lineItems,
      mode: "payment",
      success_url: "http://127.0.0.1:5173/checkout/success",
      cancel_url: "http://127.0.0.1:5173/checkout/cancel",
    });

    console.log(session);
    //console.log(customer);
    res.json({ msg: "probando respuesta", lineItems, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong to Post Checkout" });
  }
};

module.exports = { checkoutPost };
