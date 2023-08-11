const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');

// Your Twilio credentials
const accountSid = 'AC738af9927944f6d365ef296353803f6f';
const authToken = '0e2d65aa71b87293eb2a408a9284467e';

// Create a Twilio client
const client = twilio(accountSid, authToken);

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
const qr = require('qrcode');
const http = require('http');

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}
const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://Hal:1PyxnQkogBi0QbTi@cluster0.aws60.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const paymentSchema = {
  paymentCut: {
    type: Number,
    required: true,
  },
};

const {resolve} = require('path');
// Replace if using a different env file or config
const env = require('dotenv').config({path: './.env'});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    // For sample support and debugging, not required for production:
    name: 'stripe-samples/accept-a-payment/payment-element',
    version: '0.0.2',
    url: 'https://github.com/stripe-samples',
  },
});

app.get('/api/check-payment-status/:id', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({status: intent.status});
  } catch (e) {
    res.status(500).send({error: e.message});
  }
});

//static server responses
const Payment = mongoose.model('Payment', paymentSchema);

app.get('/get-stripe-balance', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    console.log(balance);
    res.json({balance});
  } catch (error) {
    res.status(500).json({error: 'Error retrieving balance.'});
  }
});

app.get('/get-transactions-history', async (req, res) => {
  try {
    const balanceTransactions = await stripe.balanceTransactions.list({
      limit: 10,
    });

    console.log(balanceTransactions);
    res.json({balanceTransactions});
  } catch (error) {
    res.status(500).json({error: 'Error retrieving balance.'});
  }
});
app.get('/get-payment-cut', async function (req, res) {
  try {
    const payment = await Payment.findOne();
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while getting the payment cut.');
  }
});

// Update Payment Cut
app.post('/set-payment-cut', async function (req, res) {
  const paymentCut = req.body.paymentCut;
  console.log(paymentCut);
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {}, // Match any document
      {paymentCut: paymentCut},
      {new: true, upsert: true} // Create if not found, return the updated document
    );
    res.send('Payment cut updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the payment cut.');
  }
});
function sendSMS(messageBody, recipientNumber) {
  console.log('HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
  client.messages
    .create({
      body: messageBody,
      from: '+12192666972',
      to: '+918699647858',
    })
    .then((message) => console.log(`SMS sent with SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}

app.get('/generate-payment-link', async (req, res) => {
  try {
    const productId = generateRandomId();

    const amount = req.query.amount;
    console.log(amount);

    // Create product
    const product = await stripe.products.create({
      name: productId.toString() + 'temp',
    });
    // console.log('product:', product);

    // Create price for amount
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'inr',
    });
    // console.log(price);

    // Create payment link using price
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append(
      'Authorization',
      'Basic c2tfdGVzdF81MU5kT3ZzU0h3R0FpQWFvT3luVEZLYmZ3SWs5ZmdhenlCMzdCcHFBemFxVDY1STZZazF2Y25TSm1VWExJMW10ZjI0Q1k3bmNVSlBEUEgzV0NydjNBdjFQbTAwQVhSNHRXZVE6'
    );

    var urlencoded = new URLSearchParams();
    urlencoded.append('line_items[0][price]', price.id.toString());
    urlencoded.append('line_items[0][quantity]', '1');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };

    const paymentLink = fetch(
      'https://api.stripe.com/v1/payment_links',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);

        const qrCodeData = result.url.toString();
        const qrCodeOptions = {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.9,
          margin: 1,
        };
        // pollPaymentStatus(product.id, price.id);
        qr.toDataURL(qrCodeData, qrCodeOptions, async (err, qrCodeDataURL) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return res.status(500).send('Error generating QR code.');
          } else {
            // Send the QR code image data URL along with the payment link URL
            res.json({
              qrCodeDataURL: qrCodeDataURL,
              paymentLinkURL: result.url.toString(),
            });
          }
        });
      })
      .catch((error) => console.log('error', error));
  } catch (error) {
    console.error('Error generating payment link:', error);
    return res.status(500).json({error: 'Error generating payment link.'});
  }
});

app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);
let paymentStatus = 'pending';

app.get('/', (req, res) => {
  res.sendFile('landing.html', { root: './stripe' });
});

app.get('/payment', (req, res) => {
  res.sendFile('payment.html', { root: './stripe' });
});

app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
app.get('/success', (req, res) => {
  res.send('success');
});

async function pollPaymentStatus(productId, priceId) {
  const interval = 10000; // Polling interval in milliseconds (10 seconds)
  while (paymentStatus !== 'succeeded') {
    try {
      const response = await fetch(
        `/api/check-payment-status/${paymentIntentID}`
      );

      const data = await response.json();
      console.log('Payment status:', data.status);
      paymentStatus = data.status;
    } catch (error) {
      console.error('Error polling payment status:', error);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
app.post('/webhook', async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(err);
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'payment_intent.succeeded') {
    console.log(data);
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log('💰 Payment captured!');
    console.log('if vali');

    const messageBody = 'Payment recieved in Stripe!';
    const recipientNumber = '+918699647858'; // Replace with recipient's phone number
    sendSMS(messageBody, recipientNumber);
  } else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.');
  } else {
    console.log('else vali');
    res.sendStatus(200);
  }
});

app.listen(4242, () =>
  console.log(`Node server listening at http://localhost:4242`)
);
