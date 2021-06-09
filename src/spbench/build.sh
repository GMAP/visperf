export DEBIAN_FRONTEND=noninteractive
export TZ=UTC
export TERM=xterm-256color
export LANG=C.UTF-8

sudo apt-get update
sudo apt-get install -y ca-certificates
sudo apt-get install -y git \
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
sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"
sudo apt-get install -y zlib1g-dev \
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
    openjdk-8-jdk
sudo ln -s /usr/include/libv4l1-videodev.h /usr/include/linux/videodev.h

git clone https://github.com/GMAP/SPBench.git ~/SPBench

cd ~/SPBench/libs/ffmpeg
chmod +x setup_ffmpeg.sh
./setup_ffmpeg.sh
source setup_ffmpeg_vars.sh

# https://stackoverflow.com/a/47005401
cd ~/SPBench/libs/opencv
chmod +x setup_opencv.sh
./setup_opencv.sh
source setup_opencv_vars.sh
