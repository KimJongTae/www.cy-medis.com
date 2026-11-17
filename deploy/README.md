# 배포 (CI/CD)

`main` 브랜치에 push 하면 GitHub Actions 가 자동으로 실행됩니다.

```
push ─▶ ① test   린트 · 타입체크 · 빌드 · E2E(브라우저로 문의접수~관리자 글쓰기/삭제까지 30개 항목)
        ② image  Docker 이미지 빌드 → ghcr.io/kimjongtae/www.cy-medis.com:{latest, sha-xxxxxxx}
        ③ deploy 서버에 SSH 접속 → 새 이미지로 교체 → 헬스체크 → 실패 시 직전 버전으로 자동 롤백
```
- Pull Request 에서는 ① 만 실행됩니다.
- ③ 은 아래 서버 준비와 GitHub 설정을 마치면 켜집니다. 그 전까지는 건너뜁니다.

## 1. 서버 준비 (최초 1회)
Ubuntu 등 리눅스 서버, 공인 IP, 80/443 포트 개방이 필요합니다.

```bash
# Docker 설치
curl -fsSL https://get.docker.com | sudo sh

# 배포 전용 사용자 생성 (docker 권한)
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo mkdir -p /opt/cymedical && sudo chown deploy:deploy /opt/cymedical

# 관리자 비밀번호/세션 키 설정
sudo -u deploy bash -c 'cat > /opt/cymedical/app.env <<EOF
ADMIN_PASSWORD=여기에-관리자-비밀번호
SESSION_SECRET=$(openssl rand -base64 48)
EOF
chmod 600 /opt/cymedical/app.env'
```

배포용 SSH 키를 **내 PC**에서 만들고, 공개키를 서버에 등록합니다.
```bash
ssh-keygen -t ed25519 -f cymedical_deploy -N "" -C "github-actions-deploy"
ssh-copy-id -i cymedical_deploy.pub deploy@서버IP     # 또는 서버의 ~deploy/.ssh/authorized_keys 에 추가
ssh-keyscan -H 서버IP > known_hosts.txt               # 서버 지문 (위조 서버 접속 방지용)
```

도메인 DNS 에서 `www.cy-medis.com`, `cy-medis.com` 의 A 레코드를 서버 IP 로 바꾸면 HTTPS 인증서가 자동 발급됩니다(Caddy).
도메인이 다르면 `deploy/Caddyfile` 을 수정하세요.

## 2. GitHub 설정
저장소 → **Settings → Secrets and variables → Actions**

| 종류 | 이름 | 값 |
|---|---|---|
| Secret | `DEPLOY_SSH_KEY` | `cymedical_deploy` (개인키) 파일 내용 전체 |
| Secret | `DEPLOY_KNOWN_HOSTS` | `known_hosts.txt` 파일 내용 |
| Variable | `DEPLOY_HOST` | 서버 IP 또는 호스트명 — **이 값을 넣으면 자동 배포가 켜집니다** |
| Variable | `DEPLOY_USER` | `deploy` |
| Variable | `DEPLOY_PORT` | (선택) SSH 포트, 기본 22 |
| Variable | `DEPLOY_PATH` | (선택) 기본 `/opt/cymedical` |
| Variable | `SITE_URL` | (선택) `https://www.cy-medis.com` — 배포 기록에 링크로 표시 |

설정 후 **Actions → CI/CD → Run workflow** 로 바로 배포하거나, `main` 에 push 하면 됩니다.

## 운영
```bash
cd /opt/cymedical
docker compose ps                       # 상태
docker compose logs -f app              # 로그
cat .current-tag                        # 현재 배포 버전
IMAGE=ghcr.io/kimjongtae/www.cy-medis.com bash deploy.sh sha-xxxxxxx   # 특정 버전으로 수동 배포/롤백
```

**백업:** `/opt/cymedical/data/` (DB + 첨부파일) 폴더만 보관하면 됩니다.
```bash
tar czf ~/cymedical-backup-$(date +%F).tgz -C /opt/cymedical data
```
