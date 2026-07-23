import { LetterStack } from './components/LetterStack';

const LETTERS = [
  {
    id: '1',
    coverSrc: '/letter-01/cover.png',
    topSrc: '/letter-01/top.png',
    bottomSrc: '/letter-01/bottom.png',
  },
  {
    id: '2',
    coverSrc: '/letter-01/cover.png',
    topSrc: '/letter-01/top.png',
    bottomSrc: '/letter-01/bottom.png',
  },
  {
    id: '3',
    coverSrc: '/letter-01/cover.png',
    topSrc: '/letter-01/top.png',
    bottomSrc: '/letter-01/bottom.png',
  },
];

export default function App() {
  return (
    <div className="page">
      <div className="letter-stage">
        <LetterStack letters={LETTERS} noteWidth={320} />
      </div>
    </div>
  );
}
