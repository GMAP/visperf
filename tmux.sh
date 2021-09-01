#!/bin/sh

session="visperf"
# tmux kill-session -t $session
session_exists=$(tmux list-sessions | grep $session)

if [ "$session_exists" = "" ]; then
    tmux new-session -d -s $session -x "$(tput cols)" -y "$(tput lines)"

    tmux rename-window -t 0 "main"
    tmux send-keys -t "main" "vim -c 'Lex'" C-m
    tmux split-window -v -p 25
    tmux select-pane -t 1
    tmux split-window -h -p 50
    tmux select-pane -t 0

    tmux new-window -t $session:1 -n "vis"
    tmux send-keys -t "vis" "cd src/visperf-dashboard" C-m "vim -c 'Lex'" C-m
    tmux split-window -v -p 25
    tmux send-keys -t 1 "cd src/visperf-dashboard" C-m
    tmux select-pane -t 1
    tmux split-window -h -p 50
    tmux send-keys -t 2 "cd src/visperf-dashboard" C-m
    tmux select-pane -t 0
fi

tmux select-window -t $session:0
tmux attach-session -t $session
