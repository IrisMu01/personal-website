/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Particles from 'react-tsparticles';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 32px;
  flex-direction: column;
  font-family: 'Courier', 'Times New Roman', 'Times', serif;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/features" component={FeaturePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
      <Particles
        id="tsparticles"
        options={{
          fpsLimit: 60,
          backgroundMask: {
            composite: 'destination-over',
            cover: {
              color: {
                value: '#000000',
              },
              opacity: 0.1,
            },
            enable: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 20,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
          particles: {
            color: {
              value: ['#c0aef5', '#b0e2ff'],
            },
            links: {
              color: ['#c0aef5', '#b0e2ff'],
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 80,
            },
            shape: {
              type: 'circle',
            },
            size: {
              random: true,
              value: 4,
            },
          },
        }}
      />
      <GlobalStyle />
    </AppWrapper>
  );
}
