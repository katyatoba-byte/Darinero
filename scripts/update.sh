#!/bin/bash
# DARINERO build & deploy, run by cron when /home/darinero/update/update.request exists.
# The request file may contain {"mode":"build"} (build only, no deploy),
# {"mode":"deploy"} (build + publish) or anything else / nothing = "sync"
# (git pull + npm install + build + publish – what the old sync button did).
# The live site is only replaced when the build succeeds.
# (no "set -u": the Node environment activate script uses unset variables)
D=/home/darinero
U=$D/update
LOG=$U/update.log

# Keep the log small (it used to grow forever).
if [ -f "$LOG" ] && [ "$(stat -c%s "$LOG")" -gt 2000000 ]; then
  tail -c 500000 "$LOG" > "$LOG.prev"; : > "$LOG"
fi
exec >> "$LOG" 2>&1

MODE=$(grep -o '"mode":"[a-z]*"' "$U/update.request" 2>/dev/null | cut -d'"' -f4)
rm -f "$U/update.request"     # consume the request – never loop
MODE=${MODE:-sync}
echo "===== START $(date) mode=$MODE"
echo "running $(date) mode=$MODE" > "$U/last-status"

source $D/nodevenv/repositories/Darinero/22/bin/activate
cd $D/repositories/Darinero || { echo "failed: no repo" > "$U/last-status"; exit 1; }

if [ "$MODE" = "sync" ]; then
  git pull --ff-only || echo "git pull skipped (local changes or diverged)"
fi
# "reset": make the server copy exactly match GitHub (main), then build + publish.
if [ "$MODE" = "reset" ]; then
  if ! { git fetch origin main && git reset --hard origin/main; }; then
    echo "git reset failed – live site untouched"
    echo "failed $(date) git" > "$U/last-status"
    exit 1
  fi
fi

# Apply uploaded source changes from /home/darinero/staging-src, if any.
if [ -d $D/staging-src/src ]; then
  echo "applying staged source"
  rm -rf $D/staging-src/scripts $D/staging-src/*.zip
  cp -a $D/staging-src/. $D/repositories/Darinero/
  rm -rf $D/staging-src/*
  rm -f $D/repositories/Darinero/src/constants.ts
fi
if [ "$MODE" = "sync" ] || [ "$MODE" = "install" ]; then
  npm install --include=optional
fi

export RAYON_NUM_THREADS=1 OXIDE_THREADS=1 UV_THREADPOOL_SIZE=1
rm -rf $D/build-new
if ! npm run build -- --outDir $D/build-new --emptyOutDir; then
  echo "BUILD FAILED – live site untouched"
  echo "failed $(date) mode=$MODE" > "$U/last-status"
  exit 1
fi
if [ ! -f $D/build-new/index.html ] || [ ! -f $D/build-new/api/content.php ]; then
  echo "BUILD INCOMPLETE – live site untouched"
  echo "failed $(date) incomplete" > "$U/last-status"
  exit 1
fi
if [ "$MODE" = "build" ]; then
  echo "build only – not published"
  echo "built $(date)" > "$U/last-status"
  exit 0
fi

# Data folder (outside public_html) and one-time admin activation code.
mkdir -p $D/darinero-data
chmod 750 $D/darinero-data
if [ ! -f $D/darinero-data/admin.json ] && [ ! -f $D/darinero-data/setup-code.txt ]; then
  head -c 9 /dev/urandom | od -An -tx1 | tr -d ' \n' > $D/darinero-data/setup-code.txt
  chmod 640 $D/darinero-data/setup-code.txt
fi

# Backup the live site (keep the last 3), then publish.
mkdir -p $D/site-backups
cp -a $D/public_html "$D/site-backups/public_html-$(date +%Y%m%d-%H%M%S)"
ls -1dt $D/site-backups/public_html-* | tail -n +4 | xargs -r rm -rf

find $D/public_html -mindepth 1 -maxdepth 1 ! -name '.well-known' ! -name 'cgi-bin' -exec rm -rf {} +
cp -a $D/build-new/. $D/public_html/
rm -rf $D/build-new


echo "published $(date) mode=$MODE" > "$U/last-status"
echo "===== DONE $(date)"
