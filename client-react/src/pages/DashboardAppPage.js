import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppOrderTimeline, AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default function DashboardAppPage() {
  const [paymentCut, setPaymentCutValue] = useState(0);
  const [stripeBalance, setStripeBalance] = useState(0);
  const [stripeHistory, setStripeHistory] = useState([]);
  const [investAmount, setInvestAmount] = useState(0);
  const [investHistory, setInvestHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [balanceResponse, paymentCutResponse, transactionsResponse] = await Promise.all([
                axios.get('http://localhost:4242/get-stripe-balance'),
                axios.get('http://localhost:4242/get-payment-cut'),
                axios.get('http://localhost:4242/get-transactions-history')
            ]);

            const { balance: { pending: [{ amount: pendingBalance }] } } = balanceResponse.data;
            setStripeBalance(pendingBalance);

            const { paymentCut } = paymentCutResponse.data;
            setPaymentCutValue(paymentCut);

            const transactions = transactionsResponse.data.balanceTransactions.data.map((transaction) => ({
                amount: transaction.amount,
                created: new Date(transaction.created * 1000).toISOString(),
            }));
            setStripeHistory(transactions);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
}, []);

  useEffect(() => {
    const updatedInvestments = stripeHistory.map((transaction) => ({
      investmentAmount: transaction.amount - (transaction.amount * paymentCut) / 100,
      created: transaction.created,
    }));
    setInvestHistory(updatedInvestments);
  }, [stripeHistory, paymentCut]);

  useEffect(() => {
    const amount = stripeBalance - (stripeBalance * paymentCut) / 100;
    setInvestAmount(amount);
  }, [stripeBalance, paymentCut]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Smart Investor</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Total Money"
              total={stripeBalance / 100}
              icon={'ant-design:dollar-circle-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Remaining Money"
              total={(investAmount / 100).toFixed(3)}
              color="error"
              icon={'ant-design:money-collect-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Invested Money"
              total={((stripeBalance - investAmount) / 100).toFixed(3)}
              color="warning"
              icon={'ant-design:euro-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Investments"
              chartLabels={investHistory.map((investment) => investment.created.split('T')[0])}
              chartData={[
                {
                  name: 'Amount',
                  type: 'line',
                  fill: 'solid',
                  data: investHistory.map((investment) => investment.investmentAmount),
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Payment History"
              subheader={`Available Balance: INR ${stripeBalance / 100}`}
              list={stripeHistory.map((transaction, index) => ({
                id: index,
                title: `Transaction Amount: INR ${transaction.amount / 100}`,
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
