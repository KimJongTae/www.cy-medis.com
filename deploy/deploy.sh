#!/usr/bin/env bash
# 서버에서 실행되는 배포 스크립트 (GitHub Actions 가 SSH 로 호출, 수동 실행도 가능)
#   사용법: bash deploy.sh <이미지 태그>      예) bash deploy.sh sha-c291760
#   표준입력으로 GHCR 토큰을 받으면 로그인 후 이미지를 받습니다(비공개 이미지).
# 새 버전이 정상 응답하지 않으면 직전 버전으로 자동 롤백합니다.
set -euo pipefail

TAG="${1:?이미지 태그가 필요합니다}"
IMAGE="${IMAGE:-ghcr.io/kimjongtae/www.cy-medis.com}"
cd "$(dirname "$0")"

if [ ! -t 0 ]; then
  TOKEN="$(cat)"
  if [ -n "$TOKEN" ]; then
    printf '%s' "$TOKEN" | docker login ghcr.io -u "${GHCR_USER:-github}" --password-stdin >/dev/null
    trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT
  fi
fi

[ -f app.env ] || { echo "app.env 가 없습니다. deploy/README.md 의 서버 준비 단계를 먼저 진행하세요." >&2; exit 1; }
mkdir -p data
PREV="$(cat .current-tag 2>/dev/null || true)"

up() {
  IMAGE="$IMAGE" IMAGE_TAG="$1" docker compose pull app
  # 컨테이너는 node(uid 1000) 사용자로 실행되므로 데이터 폴더 소유권을 맞춤
  IMAGE="$IMAGE" IMAGE_TAG="$1" docker compose run --rm --no-deps --user root --entrypoint chown app -R 1000:1000 /app/data
  IMAGE="$IMAGE" IMAGE_TAG="$1" docker compose up -d --remove-orphans
}

healthy() {
  for _ in $(seq 1 40); do
    if docker compose exec -T app node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
      return 0
    fi
    sleep 3
  done
  return 1
}

echo "▶ 배포: $IMAGE:$TAG (이전: ${PREV:-없음})"
up "$TAG"
if healthy; then
  echo "$TAG" > .current-tag
  docker image prune -f --filter "label=org.opencontainers.image.source" >/dev/null || true
  echo "✔ 배포 완료: $TAG"
else
  echo "✘ 새 버전이 응답하지 않습니다. 로그:" >&2
  docker compose logs --tail 80 app >&2 || true
  if [ -n "$PREV" ]; then
    echo "↩ 이전 버전($PREV)으로 롤백합니다." >&2
    up "$PREV"
  fi
  exit 1
fi
