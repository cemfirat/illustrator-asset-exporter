#!/usr/bin/env bash
# Optional macOS post-processing step: create lossless WebP files from Web/PNG.
# Requires: brew install webp
set -euo pipefail

usage() {
  echo "Usage: $0 <Illustrator_Export_YYYYMMDD_HHMMSS directory | Web directory> [--lossless | --lossy 85]" >&2
  exit 2
}

[[ $# -ge 1 ]] || usage
root="${1%/}"
shift
if [[ "${root##*/}" == "Web" ]]; then
  web_dir="$root"
else
  web_dir="$root/Web"
fi
png_dir="$web_dir/PNG"
out_dir="$web_dir/WebP"
[[ -d "$png_dir" ]] || { echo "Missing input directory: $png_dir" >&2; exit 1; }
if ! command -v cwebp >/dev/null 2>&1; then
  echo "Missing 'cwebp'. On macOS install it with: brew install webp" >&2
  exit 1
fi
mode="${1:---lossless}"
if [[ "$mode" == "--lossless" ]]; then
  args=(-lossless -m 6)
elif [[ "$mode" == "--lossy" ]]; then
  quality="${2:-85}"
  [[ "$quality" =~ ^[0-9]+$ ]] && (( quality >= 0 && quality <= 100 )) || usage
  args=(-q "$quality" -m 6)
else
  usage
fi
mkdir -p "$out_dir"
count=0
while IFS= read -r -d '' png; do
  filename="${png##*/}"
  name="${filename%.*}"
  cwebp -quiet "${args[@]}" "$png" -o "$out_dir/$name.webp"
  count=$((count + 1))
done < <(find "$png_dir" -maxdepth 1 -type f -iname '*.png' -print0)
printf 'Created %s WebP file(s) in %s\n' "$count" "$out_dir"
