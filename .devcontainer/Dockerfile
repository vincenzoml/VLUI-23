FROM nvcr.io/nvidia/pytorch:23.08-py3

RUN apt update
RUN apt -y dist-upgrade
RUN apt -y install git git-lfs
RUN apt -y install python3 python3-pip 
RUN apt -y install htop screen unzip psmisc nvtop wget 
RUN apt -y install libgl-dev libegl-dev libfreetype-dev libglib2.0-0 
RUN apt -y install ca-certificates curl gnupg

RUN pip install torch
RUN pip install torchsde
RUN pip install einops
RUN pip install transformers>=4.25.1
RUN pip install safetensors>=0.3.0
RUN pip install aiohttp
RUN pip install accelerate
RUN pip install pyyaml
RUN pip install Pillow
RUN pip install scipy
RUN pip install tqdm
RUN pip install psutil
RUN pip install scikit-image
RUN pip install segment-anything
RUN pip install lark

RUN rm -rf /usr/local/nvm

RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt update
RUN apt -y install nodejs

#RUN nvm install node

RUN echo "root:root" | chpasswd
RUN useradd -ms /bin/bash -u 1000 anymatix
USER anymatix
WORKDIR /home/anymatix

#RUN pip install diffusers
#RUN pip install scipy 
#RUN pip install ftfy 
#RUN pip install moviepy 
#RUN pip install opencv-python 
#RUN pip install ipykernel 
#RUN pip install matplotlib 
#RUN pip install intervaltree 
#RUN pip install autopep8 
#RUN pip install ipywidgets 
#RUN pip install opencv-contrib-python 
#RUN pip install moderngl 
#RUN pip install moderngl-window 
#RUN pip install lazy 
#RUN pip install mido 
#RUN pip install imageio 
#RUN pip install imageio[pyav] 
#RUN pip install imageio[ffmpeg] 
#RUN pip install controlnet_aux 
#RUN pip install rembg 
#RUN pip install transformers 
#RUN pip install accelerate 
#RUN pip install xformers
