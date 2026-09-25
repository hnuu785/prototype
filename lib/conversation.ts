import { questions, type DemoState } from './greencheck.ts';

export const skipAnswer = '모름·건너뛰기';

export function openingReply(concern: string): string {
  if (/춥|추워|외풍/.test(concern) && /물기|결로|젖/.test(concern)) return '추운 공간과 창가의 물기가 함께 걱정되시는군요. 원인을 단정하기 전에 언제, 어디서 나타나는지부터 함께 살펴볼게요.';
  if (/춥|추워|외풍/.test(concern)) return '집 안이 춥게 느껴지시는군요. 어떤 공간에서, 언제 그런지부터 함께 살펴볼게요.';
  if (/물기|결로|젖/.test(concern)) return '창가나 벽에 물기가 생기는군요. 나타나는 공간과 시기를 먼저 확인해볼게요.';
  if (/요금|비용|에너지/.test(concern)) return '냉난방비가 부담되시는군요. 집의 상태와 이용 방식을 차근차근 살펴볼게요.';
  return '말씀해주신 불편을 기록했어요. 필요한 단서를 하나씩 확인해볼게요.';
}

export function interpretedAnswer(id: string, input: string): string | null {
  const text = input.trim().replace(/\s+/g, ' ');
  const question = questions.find(item => item.id === id);
  if (!question || 'asset' in question || !text) return null;
  const exact = question.options.find(option => option === text);
  if (exact) return exact;
  if (id === 'room') {
    if (/안\s*춥|안\s*추워|아니|없/.test(text)) return null;
    const matches = [
      [/아이\s*방|자녀\s*방|어린이\s*방/, '아이 방'],
      [/거실/, '거실'],
      [/안방|침실/, '안방'],
    ] as const;
    const found = matches.filter(([pattern]) => pattern.test(text));
    if (found.length === 1) return found[0][1];
  }
  if (id === 'timing') {
    if (/비.{0,5}(온|내린)|장마/.test(text)) return '비가 온 뒤';
    if (/아침|밤|새벽/.test(text)) return '겨울 아침과 밤';
    if (/겨울\s*내내|겨울\s*동안|계속/.test(text)) return '겨울 내내';
  }
  if (id === 'vent') {
    if (/환기.{0,8}(못|안|어렵)|자주.{0,5}못|거의.{0,5}안/.test(text)) return '추워서 자주 환기하지 못해요';
    if (/하루.{0,6}(2|두|이)\s*번|자주\s*환기/.test(text)) return '하루 2번 이상 환기해요';
  }
  return null;
}

export function agentAcknowledgement(state: DemoState, id: string): string {
  const answer = state.answers[id];
  const attachment = state.attachments[id];
  if (state.notes[id] && answer === skipAnswer) return '말씀해주신 내용은 기록했어요. 이 항목은 자동으로 판단하기 어려워 미확인으로 남기고, 전문가에게 그대로 전달할게요.';
  if (answer === skipAnswer || attachment?.kind === 'skipped') return '괜찮아요. 지금 모르는 내용은 미확인으로 남겨두고 다음 단서를 살펴볼게요.';
  if (id === 'room') return answer === '아이 방' ? '아이 방이군요. 아이가 머무는 공간부터 살펴볼게요.' : `${answer}이군요. 그 공간을 중심으로 살펴볼게요.`;
  if (id === 'timing') return answer === '비가 온 뒤' ? '비가 온 뒤라면 누수 가능성도 현장에서 구분해야겠어요.' : '추운 시기에 나타나는군요. 창과 벽의 상태를 함께 살펴볼게요.';
  if (id === 'house') return '집의 연식과 면적을 확인했어요. 이 조건은 뒤의 비교 예시에 사용돼요.';
  if (id === 'family') return '함께 사는 분과 집에 머무는 시간도 기록해둘게요.';
  if (id === 'vent') return answer === '추워서 자주 환기하지 못해요' ? '추워서 창을 열기 어렵군요. 물기의 원인을 볼 때 습도와 환기도 함께 고려할게요.' : '환기 습관을 기록했어요. 실제 습도는 아직 측정되지 않았어요.';
  if (attachment?.kind === 'upload') return '파일을 받았어요. 이 체험에서는 미리보기만 가능해 사진 내용은 분석하지 않아요.';
  if (attachment?.kind === 'sample') return '대표 사례의 예시 자료를 불러왔어요. 다음 점검은 이 가상 자료를 기준으로 보여드릴게요.';
  return '기록했어요. 다음 내용을 살펴볼게요.';
}

export function answerDisplay(state: DemoState, id: string): string {
  const attachment = state.attachments[id];
  if (attachment) return attachment.kind === 'skipped' ? '지금은 건너뛸게요' : attachment.kind === 'reattach' ? `${attachment.name} · 다시 첨부 필요` : `${attachment.name} ${attachment.kind === 'sample' ? '· 예시 자료' : '· 미리보기만'}`;
  if (state.notes[id]) return state.notes[id];
  return state.answers[id] === skipAnswer ? '지금은 잘 모르겠어요' : state.answers[id] || '';
}
