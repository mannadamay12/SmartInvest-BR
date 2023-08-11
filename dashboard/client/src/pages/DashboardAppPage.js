import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { Grid, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppOrderTimeline,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';
// ----------------------------------------------------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};
export default function DashboardAppPage() {
  const [paymentCut, setPaymentCutValue] = useState([]);
  const [stripeBalance, setStripeBalance] = useState([]);
  const [stripeHistory, setStripeHistory] = useState([]);
  const [investAmount, setInvestAmount] = useState([]);
  const [investHistory, setInvestHistory] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3001/get-stripe-balance')
      .then(response => {
        const data = response.data;
        const pendingBalance = data.balance.pending[0].amount;
        console.log(pendingBalance);
        setStripeBalance(pendingBalance);
      })
      .catch(error => {
        console.error(error);
      });
    axios.get('http://localhost:3001/get-payment-cut')
      .then(response => {
        const data = response.data;
        const payment = data.paymentCut;
        setPaymentCutValue(payment);
      })
      .catch(error => {
        console.error(error);
      });
    axios.get('http://localhost:3001/get-transactions-history')
      .then(response => {
        const data = response.data;
        const transactions = data.balanceTransactions.data.map(transaction => ({
          amount: transaction.amount,
          created: new Date(transaction.created * 1000).toISOString()
        }));
        console.log(transactions);
        setStripeHistory(transactions);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const updatedInvestments = stripeHistory.map(transaction => ({
      investmentAmount: transaction.amount - (transaction.amount * paymentCut / 100),
      created: transaction.created
    }));
    console.log(updatedInvestments)
    setInvestHistory(updatedInvestments);
  }, [stripeHistory]);

  useEffect(()=>{
    const amount = stripeBalance - (stripeBalance * paymentCut / 100);
    setInvestAmount(amount);
  },[investAmount]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Smart Investor </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome back
        </Typography>
        

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Available Balance" total={stripeBalance} icon={'ant-design:dollar-circle-filled'} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Investment Amount" total={investAmount} color="error" icon={'ant-design:money-collect-filled'} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Remaining Balance" total={stripeBalance-investAmount} color="warning" icon={'ant-design:euro-circle-filled'} />
          </Grid>

          
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Investments"
              chartLabels={investHistory.map(investment => investment.created.split('T')[0])}
              chartData={[
                {
                  name: 'Amount',
                  type: 'line',
                  fill: 'solid',
                  data: investHistory.map(investment => investment.investmentAmount),
                },
              ]}
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Payment History"
              subheader={`Available Balance : INR ${stripeBalance}`}
              list={stripeHistory.map((transaction, index) => ({
                id: faker.datatype.uuid(),
                title: `Transaction Amount: INR ${transaction.amount}`,
                type: `order${index + 1}`,
                time: formatDate(transaction.created),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
