import { Provider } from "react-redux";
import styled from "styled-components";
import store from "./components/store/store";
import GlobalStyle from "./components/styles/GlobalStyles";
import MainPage from "./Mainpage";
import { QueryClientProvider, QueryClient } from "react-query";
import "./axiosConfig";
import { AutoLogoutProvider } from "./providers";
import { ErrorBoundary } from "./components/errorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Wrapper>
          <GlobalStyle />
          <Provider store={store}>
            <ErrorBoundary>
              <AutoLogoutProvider>
                <MainPage />
              </AutoLogoutProvider>
            </ErrorBoundary>
          </Provider>
        </Wrapper>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  display: flex;
  justify-content: center;
`;
