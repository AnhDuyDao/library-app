import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { HomePage } from './layouts/HomePage/HomePage';
import { BookCheckoutPage } from './layouts/BookChekoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookChekoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';
import { ReadBookPage } from './layouts/BookChekoutPage/ReadBookPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const history = useHistory();

  const customAuthHandler = () => {
    history.push('/login');
  }

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>

            <Route path="/home">
              <HomePage />
            </Route>

            <Route path="/search">
              <SearchBookPage />
            </Route>

            <Route path="/reviewlist/:bookId">
              <ReviewListPage />
            </Route>

            <Route path="/checkout/:bookId">
              <BookCheckoutPage />
            </Route>

            <Route path='/login' render={
              () => <LoginWidget config={oktaConfig} />
            }
            />

            <Route path='/login/callback' component={LoginCallback} />
            <SecureRoute path="/shelf">
              <ShelfPage />
            </SecureRoute>
            <SecureRoute path='/messages'>
              <MessagesPage />
            </SecureRoute>
            <SecureRoute path='/admin'>
              <ManageLibraryPage />
            </SecureRoute>
            <SecureRoute path='/fees'>
              <PaymentPage />
            </SecureRoute>
            <SecureRoute path='/book/:bookId'>
              <ReadBookPage />
            </SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>

  );
}
