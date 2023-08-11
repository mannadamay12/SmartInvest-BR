import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider} from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const [userCredentials, setUserCredentials] = useState(null);
  const mdUp = useResponsive('up', 'md');
  return (
    <>
    <GoogleOAuthProvider clientId="887000985290-41o307g72iqemgcu7jgpk77gils8etoh.apps.googleusercontent.com">
      <Helmet>
          <title> Login | Smart Investor </title>
        </Helmet>

        <StyledRoot>
          <Logo
            sx={{
              position: 'fixed',
              top: { xs: 16, sm: 24, md: 40 },
              left: { xs: 16, sm: 24, md: 40 },
            }}
          />

          {mdUp && (
            <StyledSection>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                Hi, Welcome Back
              </Typography>
              <img src="/assets/illustrations/illustration_login.png" alt="login" />
            </StyledSection>
          )}

          <Container maxWidth="sm">
            <StyledContent>
              <Typography variant="h4" gutterBottom>
                Sign in to the Smart Investor
              </Typography>
              <GoogleLogin className=""
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                  setUserCredentials(credentialResponse);
                  window.location.href = 'http://localhost:4242/payment';
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
              />
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>
              <LoginForm />
            </StyledContent>
          </Container>
        </StyledRoot>
      </GoogleOAuthProvider>;
      
    </>
  );
}
