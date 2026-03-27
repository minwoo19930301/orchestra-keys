# Stage Keys

브라우저에서 바로 연주할 수 있는 멀티 악기 키보드 웹앱입니다.

## Links

- Live site: [Stage Keys](https://minwoo19930301.github.io/orchestra-keys/)
- GitHub: [minwoo19930301/orchestra-keys](https://github.com/minwoo19930301/orchestra-keys)

## Features

- 8 instruments: piano, trumpet, violin, organ, flute, saxophone, guitar, xylophone
- Web Audio 기반 실시간 합성
- 데스크톱 키보드 단축키와 터치 입력 지원
- 터치 슬라이드 글리산도 지원 (모바일)
- Sustain 토글 / All Notes Off(긴급 정지) 지원
- 브라우저 내 녹음/루프(테이크 저장) 지원
- 메트로놈(BPM 조절) 지원
- Web MIDI 입력 장치 연결 지원
- 모바일 세로 화면에서 가로 모드 전환 유도
- 모바일 가로 화면 전용 레이아웃
- 악기/볼륨/옥타브/서스테인/BPM 설정 로컬 저장
- 웹 앱 설치용 `manifest.webmanifest` 포함

## How To Use

1. 사이트를 열고 `소리 켜고 시작` 버튼을 눌러 오디오를 활성화합니다.
2. 악기 랙에서 원하는 악기를 선택합니다.
3. 데스크톱에서는 키보드, 모바일에서는 터치로 연주합니다.
4. 볼륨, 옥타브, 서스테인, BPM을 필요에 맞게 조정합니다.
5. 필요하면 `Record`로 테이크를 녹음하고 `Loop`로 반복 재생합니다.
6. Web MIDI를 지원하는 브라우저에서는 `MIDI 연결`로 외부 장치도 붙일 수 있습니다.

## Controls

- 건반 단축키: `A W S E D F T G Y H U J K O L P ; '`
- `Space`: Sustain 토글
- `Esc`: All Notes Off
- 화면 버튼: Record, Loop, Metronome, MIDI 연결
- 모바일: 가로 모드 전환 시도 버튼 제공

## Run

정적 파일만으로 구성되어 있어서 아무 HTTP 서버로도 실행할 수 있습니다.

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory "/Users/minwokim/Documents/New project/orchestra-keys"
```

브라우저: `http://127.0.0.1:4173`

## Deploy

- GitHub Pages: [https://minwoo19930301.github.io/orchestra-keys/](https://minwoo19930301.github.io/orchestra-keys/)
- 정적 파일 배포라 별도 빌드 단계 없이 배포 가능

## Files

- `index.html`: UI 마크업과 컨트롤 패널
- `app.js`: 악기 프리셋, Web Audio 합성, 녹음/루프/메트로놈/MIDI 로직
- `styles.css`: 스테이지 스타일
- `manifest.webmanifest`: 모바일 설치 및 가로 모드 설정
