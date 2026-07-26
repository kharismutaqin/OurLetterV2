import { LetterStack } from './components/LetterStack';

const LETTERS = Array.from({ length: 7 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: String(i + 1),
    coverSrc: `/letter-${num}/cover.png`,
    topSrc: `/letter-${num}/top.png`,
    bottomSrc: `/letter-${num}/bottom.png`,
  };
});

export default function App() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">My Letters</h1>
        <p className="page-subtitle">Tap a letter to open it, use the arrows to browse</p>
      </header>
      <div className="letter-stage">
        <LetterStack letters={LETTERS} noteWidth={320} />
      </div>
    </div>
  );
}
