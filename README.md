# ㈜청연메디칼 홈페이지

운영 중인 그누보드5 사이트(`의료장비.com/0-cymedi/`)를 역설계해 **Next.js 16 + React 19 + Tailwind CSS v4 + SQLite** 로 다시 만든 홈페이지입니다.

## 페이지 구성
| 메뉴 | 주소 | 기존 사이트 |
|---|---|---|
| 회사소개 · 인사말 / 회사연혁 / 조직도 / 오시는길 | `/company/greeting` `/company/history` `/company/organization` `/company/location` | `company_01~04.php` |
| 제품소개 (파트너 브랜드) | `/products` | `product.php` |
| 공지사항 | `/notice`, `/notice/[id]` | `bo_table=notice` |
| 자료실 | `/resources`, `/resources/[id]` | `bo_table=news` |
| 채용문의 | `/recruit` | `rec.php` |
| 고객센터 · 온라인문의 | `/support` | `write.php?bo_table=online` |
| 관리자 | `/admin` | `bbs/login.php` |

## 문구 수정
고정 문구(인사말, 연혁, 조직도, 파트너, 채용, 연락처 등)는 `src/content/site.ts` 한 파일에 있습니다.
공지사항·자료실 글과 온라인문의는 관리자 페이지에서 관리합니다.

## 처음 실행
Node.js 24.15 이상(내장 SQLite 사용)이 필요합니다.
```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD, SESSION_SECRET 설정
npm run dev                  # http://localhost:3000
```

## 관리자
- 주소: `/admin` (사이트 하단 '관리자' 링크)
- 비밀번호: `.env.local` 의 `ADMIN_PASSWORD`
- 기능: 공지사항/자료실 글쓰기·수정·삭제, 첨부파일 업로드(파일당 30MB), 상단 고정, 온라인문의 확인·상태(신규/확인/답변완료)·메모·삭제, 이메일 답장 바로가기

## 운영 배포
```bash
npm run build
npm start            # 기본 3000번 포트, 앞단에 Nginx 등 리버스 프록시 + HTTPS 권장
```
- 운영 서버에서는 HTTPS 를 쓰세요(로그인 쿠키가 HTTPS 전용으로 발급됩니다).
- 데이터는 `DATA_DIR`(기본 `./data`)에 저장됩니다: `site.db`(게시물·문의) + `uploads/`(첨부파일).
  **백업은 이 폴더만 복사하면 됩니다.**
- 첫 실행 시 기존 자료실 글 "BIS MONITOR 브로셔"(PDF 포함, `seed/`)가 자동으로 등록됩니다.

## 기술 메모
- 게시판/문의: Server Actions + `node:sqlite`, 페이지는 요청 시 렌더링(`connection()`)
- 첨부 다운로드: `/files/[id]` (다운로드 수 집계, 업로드 폴더는 외부에 직접 노출되지 않음)
- 보안: HMAC 서명 세션 쿠키(httpOnly), 로그인/문의 횟수 제한, 문의 폼 스팸 함정 필드, 모든 관리자 액션에서 권한 재확인
- 이미지: 기존 사이트 이미지를 WebP 로 최적화(`public/images`), 로고는 SVG 로 재구성(`src/components/Logo.tsx`)
- 카카오 약도: 기존 오시는길 페이지와 같은 퍼가기 키 사용(`src/content/site.ts` 의 `kakaoMap`)
