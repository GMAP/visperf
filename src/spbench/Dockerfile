FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC
ENV TERM=xterm-256color
ENV LANG=C.UTF-8

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    apt-get install -y git \
    build-essential \
    cmake \
    yasm \
    zip \
    unzip \
    python \
    wget \
    pkg-config \
    software-properties-common

# Required to build OpenCV.
RUN add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main" && \
    apt-get install -y --no-install-recommends zlib1g-dev \
    ccache \
    libtiff-dev \
    libjemalloc-dev \
    libgtk2.0-dev \
    python-numpy \
    libgstreamer-plugins-base1.0-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    python-dev \
    python-numpy \
    libtbb2 libtbb-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libjasper-dev \
    libdc1394-22-dev \
    libgtk-3-dev \
    libv4l-dev \
    libavresample-dev \
    openjdk-8-jdk && \
    ln -s /usr/include/libv4l1-videodev.h /usr/include/linux/videodev.h

RUN git clone https://github.com/GMAP/SPBench.git /SPBench
RUN cd /SPBench/libs/bzlib && sh setup_bzlib.sh
RUN cd /SPBench/libs/ffmpeg && sh setup_ffmpeg.sh
RUN cd /SPBench/libs/gsl && sh setup_gsl.sh
RUN cd /SPBench/libs/jpeg && sh setup_jpeg.sh
# https://stackoverflow.com/a/47005401
RUN cd /SPBench/libs/opencv && sh setup_opencv.sh

WORKDIR /SPBench
