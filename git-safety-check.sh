#!/bin/bash

set -e

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
NC="\033[0m"

printf "%b\n" "${CYAN}===== Git Safety Check =====${NC}"

# ------------------------
# Check: inside git repo
# ------------------------

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf "%b\n" "${RED}ERROR: Not inside a git repository${NC}"
  exit 2
fi

printf "%b\n" "${GREEN}OK: Git repository detected${NC}"


if ! git symbolic-ref -q HEAD >/dev/null 2>&1; then
	printf "%b\n" "${RED}UNSAFE: Repository has no commits (detached or unborn HEAD)${NC}"
	exit 1
fi

# -----------------------
# Check: branch safety
# -----------------------

current_branch=$(git symbolic-ref --short HEAD)

if [[ "$current_branch" == "main" || "$current_branch" == "master" ]]; then
	printf "%b\n" "${RED}Unsafe: You are on protected branch${NC}"
	exit 1
fi

printf "%b\n" "${GREEN}OK: Working on branch '$current_branch'${NC}"