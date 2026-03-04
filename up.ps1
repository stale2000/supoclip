# Runs docker compose. Use GPU when USE_GPU=true in .env
if (Test-Path .env) {
  Get-Content .env | ForEach-Object {
    if ($_ -match '^USE_GPU=(.+)$') { $env:USE_GPU = $matches[1].Trim() }
  }
}
if ($env:USE_GPU -eq 'true') {
  docker compose -f docker-compose.yml -f docker-compose.gpu.yml @args
} else {
  docker compose @args
}
