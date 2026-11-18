import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayoutRoute } from './pages/AppLayoutRoute'
import { FeedPage } from './pages/FeedPage'
import { LoginPage } from './pages/LoginPage'
import { NewPostPage } from './pages/NewPostPage'
import { PostDetailsPage } from './pages/PostDetailsPage'
import { SignupPage } from './pages/SignupPage'
import { SessionProvider } from './session/SessionProvider'

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          {/* Feed, Detalhes e Publicar dividem o mesmo layout com o menu. */}
          <Route element={<AppLayoutRoute />}>
            <Route index element={<FeedPage />} />
            <Route path="posts/:id" element={<PostDetailsPage />} />
            <Route path="publicar" element={<NewPostPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          {/* A antiga tela inicial virou o feed. */}
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default App
