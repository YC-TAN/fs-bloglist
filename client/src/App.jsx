import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";

import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import ErrorBoundary from "./components/ErrorBoundary";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import NotFound from "./components/NotFound";
import { useUser, useUserActions } from "./store/user";

const App = () => {
  const { initUser, logout } = useUserActions();
  const user = useUser();

  useEffect(() => {
    initUser();
  }, [initUser]);

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>
            blogs
          </Button>
          {user ? (
            <div>
              <Button color="inherit" component={Link} to="/new" sx={style}>
                New Blog
              </Button>
              <button onClick={() => logout()}>logout</button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={style}>
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Notification />
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <BlogList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <Blog />
            </ErrorBoundary>
          }
        ></Route>
        <Route
          path="/new"
          element={
            <ErrorBoundary>
              <BlogForm />
            </ErrorBoundary>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};

export default App;
