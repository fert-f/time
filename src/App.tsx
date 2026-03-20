import { CalendarStrip } from './components/CalendarStrip';
import { AnalogClock } from './components/AnalogClock';
import { DigitalPanel } from './components/DigitalPanel';
import { Controls } from './components/Controls';
import { TimeText } from './components/TimeText';
import { CurrentEvent } from './components/CurrentEvent';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', marginTop: '0' }}>
        Interactive Time App
      </h1>

      <CalendarStrip />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', width: '100%', alignItems: 'center', maxWidth: '800px' }}>
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
          <AnalogClock />
          <TimeText />
        </div>

        <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1rem', boxSizing: 'border-box' }}>
          <DigitalPanel />
          <CurrentEvent />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
