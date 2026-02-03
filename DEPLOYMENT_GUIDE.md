# Mocha 웹빌더 프로젝트를 Cloudflare에 배포하는 가이드

이 문서는 Mocha 웹빌더에서 다운로드한 코드를 GitHub를 통해 Cloudflare Workers/Pages에 배포하는 전체 과정을 설명합니다.

## 개요

- **Mocha**: 웹빌더 서비스로, React + Vite + Hono + Cloudflare Workers 기반의 프로젝트를 생성
- **배포 흐름**: Mocha에서 코드 다운로드 → GitHub 업로드 → Cloudflare 자동 빌드/배포

## 사전 준비 사항

1. **GitHub 계정** 및 `gh` CLI 인증 완료
2. **Cloudflare 계정**
3. Cloudflare와 GitHub 연동 설정

---

## 단계별 배포 가이드

### 1단계: Mocha에서 코드 다운로드

Mocha 웹빌더에서 "Download Code" 버튼을 클릭하면 `.zip` 파일이 다운로드됩니다.

### 2단계: ZIP 파일 압축 해제

```bash
# ZIP 파일이 있는 디렉토리로 이동
cd /path/to/project

# 압축 해제
unzip "프로젝트명.zip"

# ZIP 파일 삭제 (GitHub에 올릴 필요 없음)
rm "프로젝트명.zip"
```

**중요**: ZIP 파일을 그대로 GitHub에 올리면 Cloudflare에서 빌드할 수 없습니다. 반드시 압축을 해제한 소스 코드를 올려야 합니다.

### 3단계: Git 저장소 초기화 및 GitHub 업로드

```bash
# Git 초기화
git init

# 모든 파일 추가
git add -A

# 첫 커밋
git commit -m "Initial commit from Mocha"

# GitHub 레포지토리 생성 및 푸시
gh repo create [레포지토리명] --public --source=. --push
```

### 4단계: Cloudflare 설정

Cloudflare 대시보드에서:

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub 레포지토리 선택
3. 빌드 설정:
   - **Build command**: `npx wrangler types && npm run build`
   - **Build output directory**: `dist/client`
   - **Deploy command**: `npx wrangler deploy`

---

## 필수 설정 파일 수정사항

### package.json

`build` 스크립트에 `wrangler types`를 추가해야 TypeScript 타입 정의가 자동 생성됩니다:

```json
{
  "scripts": {
    "build": "wrangler types && tsc -b && vite build"
  }
}
```

### wrangler.json

Mocha에서 생성한 기본 설정에서 다음을 수정:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "프로젝트명",
  "main": "./src/worker/index.ts",
  "compatibility_date": "2025-06-17",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "upload_source_maps": true,
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  }
}
```

**수정 포인트**:
1. `name`: 프로젝트명으로 변경 (Mocha 기본값은 UUID 형태)
2. `assets.directory`: `./dist/client` 명시적 지정
3. `d1_databases`, `r2_buckets`: 사용하지 않으면 제거

### .gitignore

`worker-configuration.d.ts`는 wrangler가 자동 생성하므로 gitignore에 포함:

```
dist/
node_modules/
.wrangler/
.dev.vars
worker-configuration.d.ts
```

### tsconfig.worker.json

`types` 배열에서 로컬 파일 경로 제거 (wrangler가 자동 생성):

```json
{
  "extends": "./tsconfig.node.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/worker", "worker-configuration.d.ts"]
}
```

### @vitejs/plugin-react 버전

Vite 7을 사용하는 경우, 호환되는 버전으로 업데이트 필요:

```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.3"
  }
}
```

---

## 자주 발생하는 에러와 해결 방법

### 1. Missing entry-point 에러

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**원인**: ZIP 파일만 업로드하고 소스 코드를 풀지 않음

**해결**: ZIP 압축 해제 후 소스 코드를 GitHub에 업로드

### 2. Peer dependency 충돌

```
npm error ERESOLVE could not resolve
npm error peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0" from @vitejs/plugin-react@4.4.1
```

**원인**: `@vitejs/plugin-react` 버전이 Vite 7과 호환되지 않음

**해결**: `package.json`에서 버전 업데이트
```json
"@vitejs/plugin-react": "^5.1.3"
```

### 3. worker-configuration.d.ts 관련 에러

```
error TS2688: Cannot find type definition file for './worker-configuration.d.ts'
```

**원인**: TypeScript가 아직 생성되지 않은 타입 파일을 찾으려 함

**해결**:
1. `package.json`의 build 스크립트에 `wrangler types &&` 추가
2. `tsconfig.worker.json`의 `types` 배열에서 `./worker-configuration.d.ts` 제거
3. `include`에 `worker-configuration.d.ts` 추가

### 4. Non-Wrangler worker-configuration.d.ts 에러

```
✘ [ERROR] A non-Wrangler worker-configuration.d.ts already exists
```

**원인**: 수동으로 만든 `worker-configuration.d.ts`가 wrangler와 충돌

**해결**: 파일 삭제 후 `.gitignore`에 추가, wrangler가 자동 생성하게 함

### 5. R2/D1 활성화 에러

```
✘ [ERROR] Please enable R2 through the Cloudflare Dashboard. [code: 10042]
```

**원인**: `wrangler.json`에 R2/D1 설정이 있지만 Cloudflare에서 활성화되지 않음

**해결**:
- 사용하지 않는 경우: `wrangler.json`에서 `d1_databases`, `r2_buckets` 섹션 제거
- 사용하는 경우: Cloudflare 대시보드에서 R2/D1 활성화

### 6. MIME type 에러

```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream"
```

**원인**: assets 디렉토리가 명시적으로 지정되지 않음

**해결**: `wrangler.json`에 assets directory 추가
```json
"assets": {
  "directory": "./dist/client",
  "not_found_handling": "single-page-application"
}
```

---

## 최종 프로젝트 구조

```
project/
├── .gitignore
├── index.html
├── package.json
├── wrangler.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.worker.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── react-app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── pages/
│   ├── worker/
│   │   └── index.ts
│   ├── shared/
│   │   └── types.ts
│   └── data/
└── docs/
```

---

## 배포 후 워크플로우

코드 수정 후:

```bash
git add -A
git commit -m "변경 내용 설명"
git push
```

GitHub에 푸시하면 Cloudflare가 자동으로 빌드 및 배포를 수행합니다.

---

## 체크리스트

배포 전 확인 사항:

- [ ] ZIP 파일 압축 해제됨
- [ ] ZIP 파일 삭제됨 (또는 .gitignore에 추가)
- [ ] `package.json` build 스크립트에 `wrangler types` 포함
- [ ] `wrangler.json`에서 사용하지 않는 R2/D1 바인딩 제거
- [ ] `wrangler.json`에 `assets.directory` 명시
- [ ] `@vitejs/plugin-react` 버전이 Vite 버전과 호환
- [ ] `worker-configuration.d.ts`가 `.gitignore`에 포함
- [ ] Cloudflare 빌드 명령어: `npx wrangler types && npm run build`

---

## 참고 링크

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Cloudflare Vite Plugin](https://developers.cloudflare.com/workers/frameworks/framework-guides/vite/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)
