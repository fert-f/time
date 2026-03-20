import { CalendarStrip } from './components/CalendarStrip';
import { AnalogClock } from './components/AnalogClock';
import { DigitalPanel } from './components/DigitalPanel';
import { Controls } from './components/Controls';
import { TimeText } from './components/TimeText';
import { CurrentEvent } from './components/CurrentEvent';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Interactive Time App
      </h1>
      
      <CalendarStrip />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', width: '100%', alignItems: 'center' }}>
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnalogClock />
          <TimeText />
        </div>
        
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <DigitalPanel />
          <CurrentEvent />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
