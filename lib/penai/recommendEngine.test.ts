// lib/penai/recommendEngine.test.ts
import { runPENAI } from './recommendEngine';

describe('PEN-AI Recommendation Engine', () => {

  test('stressed user — top meals are high fat/protein', () => {
    const result = runPENAI(-0.7, 0.8);
    console.log('\n😰 STRESSED');
    console.log('  Emotion:  ', result.emotion.dominant);
    console.log('  Dopamine: ', result.neuroState.dopamine.toFixed(2));
    console.log('  Serotonin:', result.neuroState.serotonin.toFixed(2));
    console.log('  Cortisol: ', result.neuroState.cortisol.toFixed(2));
    result.recommendations.forEach((m, i) =>
      console.log(`  ${i+1}. ${m.emoji} ${m.name.padEnd(12)} ${m.matchPct}%`)
    );
    expect(result.recommendations).toHaveLength(5);
    expect(result.emotion.dominant).toBeDefined();
  });

  test('happy user — top meals are light/energising', () => {
    const result = runPENAI(0.8, 0.8);
    console.log('\n😊 HAPPY');
    console.log('  Emotion:  ', result.emotion.dominant);
    result.recommendations.forEach((m, i) =>
      console.log(`  ${i+1}. ${m.emoji} ${m.name.padEnd(12)} ${m.matchPct}%`)
    );
    expect(result.recommendations).toHaveLength(5);
  });

  test('sad user — top meals boost serotonin', () => {
    const result = runPENAI(-0.6, 0.2);
    console.log('\n😢 SAD');
    console.log('  Emotion:  ', result.emotion.dominant);
    result.recommendations.forEach((m, i) =>
      console.log(`  ${i+1}. ${m.emoji} ${m.name.padEnd(12)} ${m.matchPct}%`)
    );
    expect(result.recommendations).toHaveLength(5);
  });

  test('tired user — top meals are high energy', () => {
    const result = runPENAI(-0.3, 0.1);
    console.log('\n😴 TIRED');
    console.log('  Emotion:  ', result.emotion.dominant);
    result.recommendations.forEach((m, i) =>
      console.log(`  ${i+1}. ${m.emoji} ${m.name.padEnd(12)} ${m.matchPct}%`)
    );
    expect(result.recommendations).toHaveLength(5);
  });

  test('excited user — top meals sustain energy', () => {
    const result = runPENAI(0.5, 0.9);
    console.log('\n🤩 EXCITED');
    console.log('  Emotion:  ', result.emotion.dominant);
    result.recommendations.forEach((m, i) =>
      console.log(`  ${i+1}. ${m.emoji} ${m.name.padEnd(12)} ${m.matchPct}%`)
    );
    expect(result.recommendations).toHaveLength(5);
  });

  test('different emotions produce different top meal sets', () => {
    const stressed = runPENAI(-0.7, 0.8);
    const happy    = runPENAI( 0.8, 0.8);
    const sad      = runPENAI(-0.6, 0.2);

    const stressedKeys = stressed.recommendations.map(m => m.key);
    const happyKeys    = happy.recommendations.map(m => m.key);
    const sadKeys      = sad.recommendations.map(m => m.key);

    console.log('\n📊 COMPARISON');
    console.log('  Stressed top 3:', stressedKeys.slice(0,3).join(', '));
    console.log('  Happy    top 3:', happyKeys.slice(0,3).join(', '));
    console.log('  Sad      top 3:', sadKeys.slice(0,3).join(', '));

    expect(stressedKeys.slice(0,3)).not.toEqual(happyKeys.slice(0,3));
    expect(stressedKeys.slice(0,3)).not.toEqual(sadKeys.slice(0,3));
  });

  test('match percentages are between 0 and 100', () => {
    const result = runPENAI(-0.7, 0.8);
    result.recommendations.forEach(m => {
      expect(m.matchPct).toBeGreaterThan(0);
      expect(m.matchPct).toBeLessThanOrEqual(100);
    });
  });

});