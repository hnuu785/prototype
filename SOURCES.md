# 활용범위와 출처

## 기획 원문

- 상위 폴더 `AI점검_제안요약서_최종.md`: 사용자 제공 최종 요약서. 기능과 이용 흐름, 5단계 명칭, 이용대상과 AI 역할의 기준으로 사용.
- 상위 폴더 `1. [공고문] 「제6회 그린리모델링 챌린지」 대학생 해커톤 모집 공고.pdf`: 제안서 규격·시각자료 요건 확인에 사용.

공식 기술자료·점검 지침의 실제 검색 결과나 현장 검증 데이터를 사용하지 않았습니다. UI의 근거는 예시 사진·입력 답변과 시연용 규칙의 연결을 보여줍니다. 지원사업에는 공식 출처가 없는 가상 사례임을 표시했습니다.

## 생성형 AI 활용

- OpenAI Codex: 프로토타입 설계, React/TypeScript 코드, 스타일, 시연 문구, 테스트 및 문서 작성 보조.
- OpenAI 내장 imagegen 도구: `public/images/sample-window.png` 생성. 실제 주택·거주자의 촬영 자료가 아닌 가상 사진입니다. 창호와 벽면 단계에서 동일한 이미지의 서로 다른 시야를 사용합니다.
- 생성된 사진의 물기·얼룩에 관한 설명과 등급은 고정 시연 데이터입니다. 화면에서 실제 VLM·OCR·RAG·LLM 호출을 수행하지 않습니다.

이미지 생성 최종 프롬프트:

> Use case: photorealistic-natural. Asset type: fictional sample photo for a Korean green remodeling demo, not real inspection evidence. Primary request: A close interior view of the window in a child's bedroom in an old late-1990s Korean villa apartment. Aging aluminum window frame, modest condensation droplets on the lower glass, and subtle damp staining on the adjacent pale wallpaper corner. Style/medium: photorealistic candid home inspection photograph, natural material textures, unretouched appearance. Composition/framing: horizontal 3:2 image, close view centered on the window and nearby wallpaper corner. Lighting/mood: ordinary natural daylight. Constraints: no people, no text, no logos, no watermark; subtle realistic aging, not severe decay.

## 오픈소스·서체

- Sites 제공 Vinext/React/TypeScript 기본 구성과 shadcn UI 컴포넌트 재사용.
- React: https://react.dev/ — MIT
- Vinext: https://github.com/cloudflare/vinext — MIT
- Tailwind CSS: https://tailwindcss.com/ — MIT
- Radix UI: https://www.radix-ui.com/ — MIT
- shadcn/ui: https://ui.shadcn.com/ — MIT
- Lucide: https://lucide.dev/ — ISC (아이콘)
- Zod: https://zod.dev/ — MIT (저장 상태 검증)
- 외부 웹폰트 파일을 가져오지 않고 운영체제의 기본 한글 글꼴을 사용했습니다.

정확한 의존성 버전은 `package-lock.json`, 각 패키지의 라이선스는 설치 폴더 내 LICENSE를 참고하세요. 캡처에는 참가자 성명·학교명 등 식별정보를 넣지 않았습니다.

## 제출 시 활용표기 예시

“본 프로토타입의 코드 및 화면 문구 작성에 OpenAI Codex를 보조적으로 활용하였으며, 촬영 안내용 가상 사진은 OpenAI 이미지 생성 도구로 제작하였다. React, Vinext, Tailwind CSS, shadcn/ui, Radix UI, Lucide, Zod 등 오픈소스를 활용하였다. 점검 결과와 에너지·비용·지원사업 정보는 기능 시연을 위한 가상 데이터이며, 실제 AI 분석이나 에너지 시뮬레이션 결과가 아니다.”
