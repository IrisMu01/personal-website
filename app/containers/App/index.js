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
import Background from 'components/Background';

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
      <Helmet titleTemplate="%s - Iris Mu" defaultTitle="Iris Mu">
        <meta name="description" content="Iris' Personal Website" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/features" component={FeaturePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
      <Background />
      <GlobalStyle />
    </AppWrapper>
  );
}
