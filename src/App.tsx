import { CalendarStrip } from './components/CalendarStrip';
import { AnalogClock } from './components/AnalogClock';
import { DigitalPanel } from './components/DigitalPanel';
import { Controls } from './components/Controls';
import { TimeText } from './components/TimeText';
import { CurrentEvent } from './components/CurrentEvent';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-main)' }}>
      <h1 style={{ color: 'var(--primary-color)', fontSize: 'var(--font-h1)', marginBottom: '0', letterSpacing: '-0.02em', marginTop: '0' }}>
        Interactive Time App
      </h1>

      <CalendarStrip />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--gap-widgets)', width: '100%', alignItems: 'center', maxWidth: '900px' }}>
        <div style={{ flex: '0 0 var(--col-left)', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0' }}>
          <AnalogClock />
          <TimeText />
        </div>

        <div style={{ flex: '0 0 var(--col-right)', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--gap-column)', boxSizing: 'border-box' }}>
          <DigitalPanel />
          <CurrentEvent />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
