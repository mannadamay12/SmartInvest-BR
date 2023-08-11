const stripe = require("stripe")(
    "sk_test_51NdOvsSHwGAiAaoOynTFKbfwIk9fgazyB37BpqAzaqT65I6Yk1vcnSJmUXLI1mtf24CY7ncUJPDPH3WCrv3Av1Pm00AXR4tWeQ"
  );
  const bodyParser = require("body-parser");
  const express = require("express");
  const path = require("path");
  const mongoose = require("mongoose");
  var cors = require('cors');
  mongoose.connect(
    "mongodb+srv://Hal:1PyxnQkogBi0QbTi@cluster0.aws60.mongodb.net/",
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
  
  const app = express();
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));
  const Payment = mongoose.model("Payment", paymentSchema);
  
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  app.get("/get-stripe-balance", async (req, res) => {
    try {
      const balance = await stripe.balance.retrieve();
      console.log(balance);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving balance." });
    }
  });
  
  app.get("/get-transactions-history", async (req, res) => {
    try {
      const balanceTransactions = await stripe.balanceTransactions.list({
        limit: 10,
      });
  
      console.log(balanceTransactions);
      res.json({ balanceTransactions });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving balance." });
    }
  });
  app.get("/get-payment-cut", async function (req, res) {
    try {
      const payment = await Payment.findOne();
      res.json(payment);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while getting the payment cut.");
    }
  });
  
  // Update Payment Cut
  app.post("/set-payment-cut", async function (req, res) {
    const paymentCut = req.body.paymentCut;
    console.log(paymentCut);
    try {
      const updatedPayment = await Payment.findOneAndUpdate(
        {}, // Match any document
        { paymentCut: paymentCut },
        { new: true, upsert: true } // Create if not found, return the updated document
      );
      res.send("Payment cut updated successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while updating the payment cut.");
    }
  });
  
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
  