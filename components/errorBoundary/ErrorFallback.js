import React from 'react';
import styled from 'styled-components';

const ErrorFallback = ({ error, errorInfo, resetError, fallbackComponent }) => {
  if (fallbackComponent) {
    return fallbackComponent;
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>Something went wrong</ErrorTitle>
        <ErrorMessage>
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </ErrorMessage>

        <ButtonGroup>
          <RefreshButton onClick={() => window.location.reload()}>
            Reload Page
          </RefreshButton>
          {resetError && (
            <RetryButton onClick={resetError}>
              Try Again
            </RetryButton>
          )}
        </ButtonGroup>

        {isDevelopment && error && (
          <ErrorDetails>
            <DetailsTitle>Error Details (Development Only)</DetailsTitle>
            <ErrorText>{error.toString()}</ErrorText>
            {errorInfo && (
              <StackTrace>
                <StackTitle>Component Stack:</StackTitle>
                <pre>{errorInfo.componentStack}</pre>
              </StackTrace>
            )}
          </ErrorDetails>
        )}
      </ErrorContent>
    </ErrorContainer>
  );
};

export default ErrorFallback;

const ErrorContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ErrorContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const ErrorTitle = styled.h1`
  color: #233a54;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 30px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RefreshButton = styled(Button)`
  background: #233a54;
  color: white;

  &:hover {
    background: #1a2d42;
  }
`;

const RetryButton = styled(Button)`
  background: #f0f0f0;
  color: #333;

  &:hover {
    background: #e0e0e0;
  }
`;

const ErrorDetails = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: left;
  border: 1px solid #e0e0e0;
`;

const DetailsTitle = styled.h3`
  color: #233a54;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  border-left: 3px solid #d32f2f;
  overflow-x: auto;
`;

const StackTrace = styled.div`
  margin-top: 12px;

  pre {
    color: #666;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    margin: 0;
    padding: 12px;
    background: #fff;
    border-radius: 4px;
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const StackTitle = styled.div`
  color: #666;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;
