import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Reading from "./pages/Reading";
import { Cards, CardDetail } from "./pages/Cards";
import History from "./pages/History";
import Space from "./pages/Space";
import "./styles/index.css";
class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="page empty-state">
        <h1>Chưa thể mở trang này</h1>
        <p>Vui lòng tải lại để tiếp tục hành trình của bạn.</p>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Tải lại
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function ReadingRoute(props) {
  const location = useLocation();
  return <Reading key={location.pathname + location.search} {...props} />;
}
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reading" element={<ReadingRoute />} />
            <Route
              path="love"
              element={<ReadingRoute initialCategory="love" />}
            />
            <Route
              path="career"
              element={<ReadingRoute initialCategory="career" />}
            />
            <Route
              path="finance"
              element={<ReadingRoute initialCategory="finance" />}
            />
            <Route
              path="daily"
              element={<ReadingRoute initialCategory="daily" daily />}
            />
            <Route path="cards" element={<Cards />} />
            <Route path="cards/:slug" element={<CardDetail />} />
            <Route path="history" element={<History />} />
            <Route path="space" element={<Space />} />
            <Route
              path="*"
              element={
                <div className="page empty-state">
                  <h1>Trang này chưa tồn tại</h1>
                  <Link to="/" className="button primary">
                    Về trang chủ
                  </Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
