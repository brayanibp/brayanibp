import React from 'react';
import NotFound from './NotFound';
import ServerError from './ServerError';

const ErrorPage = ({ statusCode }: { statusCode: number }) => {
  return (
    <div>
      <h1>{statusCode === 404 ? <NotFound /> : <ServerError />}</h1>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
