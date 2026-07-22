import { FoldedLetter } from './components/FoldedLetter';

export default function App() {
  return (
    <div className="page">
      <div className="letter-stage">
        <FoldedLetter
          coverSrc="/letter-01/cover.png"
          topSrc="/letter-01/top.png"
          bottomSrc="/letter-01/bottom.png"
          noteWidth={320}
        />
      </div>
    </div>
  );
}
