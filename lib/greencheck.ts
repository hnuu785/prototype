import { z } from 'zod';
export const STORAGE_KEY = 'greencheck-demo-v1';
export const pages = ['start','collect','result','compare','report','support'] as const;
export type Page = typeof pages[number];
export const pageLabels = ['시작','집 살펴보기','점검 결과','개선 효과','전문가 상담','지원 준비'];
export const questions = [
 {id:'room',label:'불편한 공간',title:'어느 공간이 가장 춥게 느껴지나요?',reason:'공간마다 창의 방향과 외벽 면적이 달라요. 먼저 불편한 곳을 좁혀볼게요.',options:['아이 방','거실','안방'],sample:'아이 방'},
 {id:'timing',label:'발생 시기',title:'주로 언제 불편함을 느끼세요?',reason:'발생 시기를 알면 외풍과 표면 결로의 가능성을 살펴볼 수 있어요.',options:['겨울 아침과 밤','겨울 내내','비가 온 뒤'],sample:'겨울 아침과 밤'},
 {id:'house',label:'집 기본정보',title:'소유하신 집이 서울의 1998년 준공 빌라, 전용 59㎡가 맞을까요?',reason:'집의 연식과 면적은 뒤에서 개선 효과를 비교할 때 같은 조건으로 사용해요.',options:['서울 · 1998년 · 59㎡ · 소유'],sample:'서울 · 1998년 · 59㎡ · 소유'},
 {id:'family',label:'거주·이용 특성',title:'아이와 함께 지내는 집인가요?',reason:'머무는 시간과 가족의 생활 특성도 개선 방향에 반영해요.',options:['자녀와 함께 거주 · 저녁과 밤 주로 재실','생활 특성을 아직 확인하지 못했어요'],sample:'자녀와 함께 거주 · 저녁과 밤 주로 재실'},
 {id:'vent',label:'환기 습관',title:'겨울에는 보통 어떻게 환기하세요?',reason:'창가 물기는 단열 성능과 함께 실내 습도·환기 습관의 영향을 받을 수 있어요.',options:['추워서 자주 환기하지 못해요','하루 2번 이상 환기해요'],sample:'추워서 자주 환기하지 못해요'},
 {id:'window',label:'창호 사진',title:'창틀과 유리 아래쪽을 보여주세요.',reason:'물기가 맺힌 위치와 창틀의 연결 부위를 함께 확인하기 위해서예요.',asset:'photo',sample:'창호 예시 사진'},
 {id:'wall',label:'벽면 사진',title:'창 옆 벽면도 함께 살펴볼까요?',reason:'창가에 물기가 있다는 답변에 따라 벽지의 얼룩 여부를 추가로 살펴봐요.',asset:'photo',sample:'창 옆 벽면 예시 사진'},
 {id:'bill',label:'에너지 고지서',title:'마지막으로 사용량 자료를 확인할게요.',reason:'개선 전후 비교에 사용할 사용량과 비용의 기준을 정리해요.',asset:'bill',sample:'대표 가구 연간 사용량 예시'},
] as const;
export type Question = typeof questions[number];
export const levels = ['관찰 유지','주의·관리','전문가 점검 권장','우선 점검 필요','신속한 현장 확인 필요'];
export const options = [
 {id:'window',name:'창호 교체',sub:'외풍과 창가의 열손실 줄이기',energy:9000,cost:135,build:[450,650],range:[8100,9900],desc:'아이 방의 노후 창호를 고성능 창호로 교체하는 예시입니다.'},
 {id:'insulation',name:'단열 보강',sub:'외벽을 통한 열손실 줄이기',energy:8400,cost:126,build:[600,850],range:[7560,9240],desc:'외기에 맞닿은 벽체의 단열을 보강하는 예시입니다.'},
 {id:'combined',name:'창호 + 단열',sub:'창과 벽의 성능을 함께 개선',energy:6600,cost:99,build:[950,1350],range:[5940,7260],desc:'창호 교체와 외벽 단열 보강을 함께 적용하는 예시입니다.'},
] as const;
export const baseline = {energy:12000,cost:180};
export type OptionId = typeof options[number]['id'];
export const attachmentSchema=z.object({kind:z.enum(['sample','upload','reattach','skipped']),name:z.string().max(300),url:z.string().optional(),mime:z.string().optional()});
export type Attachment=z.infer<typeof attachmentSchema>;
const stateSchema=z.object({version:z.literal(1),page:z.enum(pages),step:z.number().int().min(0).max(7),concern:z.string().max(1000),answers:z.record(z.string(),z.string().max(1000)),notes:z.record(z.string(),z.string().max(1000)).default({}),attachments:z.record(z.string(),attachmentSchema),selected:z.enum(['window','insulation','combined']),consent:z.boolean(),submitted:z.boolean(),checks:z.array(z.string()),started:z.boolean()});
export type DemoState=z.infer<typeof stateSchema>;
export function initialState():DemoState{return {version:1,page:'start',step:0,concern:'',answers:{},notes:{},attachments:{},selected:'combined',consent:false,submitted:false,checks:[],started:false};}
export function representativeState():DemoState{return {...initialState(),started:true,page:'collect',step:5,concern:'난방을 해도 아이 방이 춥고 창가에 물기가 생겨요',answers:Object.fromEntries(questions.filter(q=>!('asset' in q)).map(q=>[q.id,q.sample])),attachments:{window:{kind:'sample',name:'아이 방 창호 · 생성된 예시 사진'},wall:{kind:'sample',name:'창 옆 벽면 · 동일 예시 사진'},bill:{kind:'sample',name:'연간 사용량·요금 예시'}}};}
export function serializable(s:DemoState):DemoState{return {...s,attachments:Object.fromEntries(Object.entries(s.attachments).map(([k,v])=>[k,v.kind==='upload'?{kind:'reattach' as const,name:v.name,mime:v.mime}:v]))};}
export function restore(raw:string|null):DemoState{if(!raw)return initialState();try{const parsed=stateSchema.safeParse(JSON.parse(raw));if(!parsed.success)return initialState();return serializable(parsed.data);}catch{return initialState();}}
export function saving(o:typeof options[number]){return {energy:baseline.energy-o.energy,percent:Math.round((1-o.energy/baseline.energy)*100),cost:baseline.cost-o.cost};}
export function collected(s:DemoState){return questions.filter(q=>'asset' in q?['sample','upload'].includes(s.attachments[q.id]?.kind):!!s.answers[q.id]&&s.answers[q.id]!=='모름·건너뛰기'&&!s.answers[q.id].includes('확인하지 못')).length;}
export function missing(s:DemoState){return questions.filter(q=>'asset' in q?s.attachments[q.id]?.kind!=='sample':!s.answers[q.id]||s.answers[q.id]==='모름·건너뛰기'||s.answers[q.id].includes('확인하지 못')).map(q=>q.label);}
export function findings(s:DemoState){const photo=(id:string)=>s.attachments[id]?.kind==='sample';return [
 {id:'window',name:'창호',level:photo('window')?4:null,observation:photo('window')?'예시 사진에서 유리 하단의 물기와 오래된 창틀이 관찰됩니다.':'분석 가능한 예시 사진이 없어 관찰 사실을 확인하지 못했습니다.',inference:'창호 기밀·단열 성능 저하가 외풍과 낮은 표면온도에 영향을 줄 수 있습니다.',unknown:'기밀 상태, 유리 사양, 실제 표면온도는 현장 확인이 필요합니다.',action:'창호 틈과 결로 원인을 우선 점검하고, 교체 범위를 상담해보세요.'},
 {id:'wall',name:'벽체',level:photo('wall')?3:null,observation:photo('wall')?'예시 사진에서 창 옆 벽지의 국소적인 얼룩이 관찰됩니다.':'분석 가능한 예시 사진이 없어 벽체 상태를 확인하지 못했습니다.',inference:'외벽의 낮은 표면온도 또는 열교가 관련될 수 있습니다. 누수와의 구분이 필요합니다.',unknown:'벽 내부 단열재, 수분과 누수 여부는 사진만으로 확인할 수 없습니다.',action:'전문가에게 벽체의 수분과 단열 상태 확인을 요청하세요.'},
 {id:'vent',name:'환기',level:s.answers.vent==='추워서 자주 환기하지 못해요'?2:s.answers.vent==='하루 2번 이상 환기해요'?1:null,observation:s.answers.vent&&s.answers.vent!=='모름·건너뛰기'?`입력한 환기 습관: “${s.answers.vent}”`:'환기 습관을 확인하지 못했습니다.',inference:'실내 습도와 환기 상태가 창가 물기에 영향을 줄 수 있습니다.',unknown:'실내 습도와 환기량은 측정되지 않았습니다.',action:'습도와 물기 발생 시간을 기록하고, 변화가 없으면 재점검을 받아보세요.'},
 {id:'heating',name:'냉난방 설비',level:null,observation:'설비 정보와 점검 이력이 수집되지 않았습니다.',inference:'현재 자료로 설비 성능을 추정하지 않습니다.',unknown:'설비 연식, 효율, 유지관리 이력 확인이 필요합니다.',action:'방문 상담 시 설비 사양과 작동 상태도 함께 확인해주세요.'},
];}
export const checklist=[{id:'ownership',title:'주택 소유 관계 확인',desc:'등기사항증명서 등 실제 공고에서 요구하는 서류 확인'},{id:'building',title:'건축물 기본정보 준비',desc:'건축물대장과 면적·준공연도 확인'},{id:'photos',title:'사진과 사전점검 기록 정리',desc:'창호·벽면 사진, 불편 기록, 미확인 항목'},{id:'estimate',title:'전문가 진단과 견적 상담',desc:'공사 범위와 필요 성능평가 자료 확인'}];
