#!/bin/sh

session="viscpu"
# tmux kill-session -t $session
session_exists=$(tmux list-sessions | grep $session)

if [ "$session_exists" = "" ]; then
    tmux new-session -d -s $session -x "$(tput cols)" -y "$(tput lines)"

    tmux rename-window -t 0 "main"
    tmux send-keys -t "main" "conda activate dnn" C-m "vim -c 'Lex'" C-m
    tmux split-window -v -p 25
    tmux send-keys -t 1 "conda activate dnn" C-m
    tmux select-pane -t 1
    tmux split-window -h -p 50
    tmux send-keys -t 2 "conda activate dnn" C-m
    tmux select-pane -t 0

    tmux new-window -t $session:1 -n "vis"
    tmux send-keys -t "vis" "cd src/d3-dashboard" C-m "conda activate dnn" C-m "vim -c 'Lex'" C-m
    tmux split-window -v -p 25
    tmux send-keys -t 1 "cd src/d3-dashboard" C-m "conda activate dnn" C-m
    tmux select-pane -t 1
    tmux split-window -h -p 50
    tmux send-keys -t 2 "cd src/d3-dashboard" C-m "conda activate dnn" C-m
    tmux select-pane -t 0

    tmux new-window -t $session:2 -n "paper"
    tmux send-keys -t "paper" "cd paper" C-m "conda activate dnn" C-m "vim paper.tex" C-m
    tmux split-window -v -p 25
    tmux send-keys -t 1 "cd paper" C-m "conda activate dnn" C-m
    tmux select-pane -t 1
    tmux split-window -h -p 50
    tmux send-keys -t 2 "cd paper" C-m "conda activate dnn" C-m
    tmux select-pane -t 0

    tmux new-window -t $session:3 -n "jupyter"
    tmux send-keys -t "jupyter" "jupyter-notebook" C-m
    tmux split-window -v -p 25
    tmux send-keys -t 1 "conda activate dnn" C-m
    tmux select-pane -t 0
fi

tmux select-window -t $session:0
tmux attach-session -t $session
