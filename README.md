# Stage Keys

브라우저에서 바로 연주할 수 있는 멀티 악기 키보드 웹앱입니다.

## Features

- 8 instruments: piano, trumpet, violin, organ, flute, saxophone, guitar, xylophone
- Web Audio 기반 실시간 합성
- 데스크톱 키보드 단축키와 터치 입력 지원
- 터치 슬라이드 글리산도 지원 (모바일)
- Sustain 토글 / All Notes Off(긴급 정지) 지원
- 모바일 세로 화면에서 가로 모드 전환 유도
- 모바일 가로 화면 전용 레이아웃
- 악기/볼륨/옥타브/서스테인 설정 로컬 저장

## Run

정적 파일만으로 구성되어 있어서 아무 HTTP 서버로도 실행할 수 있습니다.

```bash
python3 -m http.server 4173
```
