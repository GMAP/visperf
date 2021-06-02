project(SimpleFFTest)
cmake_minimum_required(VERSION 3.16)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS_DEBUG "-g -fno-omit-frame-pointer")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

# Core to be used on mapping.
# add_compile_options(-DMAPPING_STRING="11")

add_executable(ff-farm ff-farm.cpp)
target_include_directories(ff-farm PRIVATE "../../../libraries/fastflow")
target_link_libraries(ff-farm pthread)
