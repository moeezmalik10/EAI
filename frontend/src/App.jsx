import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import EditorialBoard from './pages/EditorialBoard.jsx';
import AuthorGuidelines from './pages/AuthorGuidelines.jsx';
import SubmitPaper from './pages/SubmitPaper.jsx';
import Archives from './pages/Archives.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import ArticleList from './pages/ArticleList.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/editorial-board" element={<EditorialBoard />} />
          <Route path="/author-guidelines" element={<AuthorGuidelines />} />
          <Route path="/submit" element={<SubmitPaper />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
