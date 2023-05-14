/*
*1. Render songs
*2. Scroll top
*3. play/ pause / seek
*4. CD rotate
*5. Next/ prev
*6. Random
*7. Next / Repeat when ended
*8. Active song
*9. Scroll active song into view
*10 Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'TH_PLAYER';

    const cd = $('.cd')
    const heading = $('header h2')
    const cdThum = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('#progress');
    const nextBtn = $('.btn-next');
    const prevBtn = $('.btn-prev');
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');
    const playList = $('.playlist');

    

const app = {
  currentIndex: 0,
  isPlaying: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function(key, value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Summertime Sadness",
      singer: "Lana Del Rey",
      path: "./asset/music/y2mate.com - Summertime Sadness  Lana Del Rey Lyrics  Vietsub.mp3",
      image: "./asset/img/sumertime.jpg"
    },
    {
      name: "Faded",
      singer: "Alan Walker",
      path: "./asset/music/y2mate.com - Alan Walker  Faded.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Ánh Nắng Của Anh",
      singer: "Đức Phúc",
      path:
        "./asset/music/y2mate.com - Ánh Nắng Của Anh Chờ Em Đến Ngày Mai OST.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Bài Ca Tôm Cá",
      singer: "Bé Nguyễn Minh Chiến  OST Anh Thầy Ngôi Sao",
      path: "./asset/music/y2mate.com - Bài Ca Tôm Cá  Yong Anhh ft Bé Nguyễn Minh Chiến  OST Anh Thầy Ngôi Sao.mp3",
      image:
        "https://tse2.mm.bing.net/th?id=OIP.GKUXMDcRj5xoJT7Mg4K1ZQHaHa&pid=Api&P=0"
    },
    {
      name: "Đường Một Chiều",
      singer: "Magazine  Official Music Video",
      path: "./asset/music/y2mate.com - Đường Một Chiều  Huỳnh Tú ft Magazine  Official Music Video.mp3",
      image:
        "https://tse3.mm.bing.net/th?id=OIP.9gdhQek9LPfAVV2Uq0FoDwHaEK&pid=Api&P=0"
    },
    {
      name: "Tháng Tư Là Lời Nói Dối Của Em",
      singer: "Hà Anh Tuấn",
      path:
        "./asset/music/y2mate.com - Hà Anh Tuấn  Tháng Tư Là Lời Nói Dối Của Em Official MV.mp3",
      image:
        "https://tse3.mm.bing.net/th?id=OIP.lJ6AbJgmsWLuyArO1opXwwHaEK&pid=Api&P=0"
    },
    {
      name: "Head In The Clouds",
      singer: "Hayd",
      path: "./asset/music/y2mate.com - Hayd  Head In The Clouds Official Video.mp3",
      image:
        "https://tse4.mm.bing.net/th?id=OIP.FCNiAHPmO6smbXaWBT6ipgHaHa&pid=Api&P=0"
    },
    {
      name: "Hẹn em ở lần yêu thứ 2",
      singer: "Nguyenn x DangtuanvuOriginal",
      path: "./asset/music/y2mate.com - Hẹn Em Ở Lần Yêu Thứ 2  Nguyenn x DangtuanvuOriginal   Official MV  Anh phải làm gì để em.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2023/03/14/a/6/c/5/1678761772034_500.jpg"
    },
    {
      name: "Sasha Alex Sloan",
      singer: "Older",
      path: "./asset/music/y2mate.com - Sasha Alex Sloan  Older Lyric Video.mp3",
      image:
        "https://tse4.mm.bing.net/th?id=OIP.LVZXbllrENh-W_wVdaUFqgHaHa&pid=Api&P=0"
    }
  ],
  render: function(){
    const htmls = this.songs.map((song,index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : '' } " data-index = "${index}">
            <div class="thumb" 
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
      </div>
  `;
    })
    playList.innerHTML = htmls.join('');
  },
  
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function(){
    const _this = this
    const cdWidth = cd.offsetWidth;
    let isRandom = false;
    let isRepeat = false;

    //Xoay CD
    const cdHandle = cdThum.animate([
      {
        transform: 'rotate(360deg)'
      }
    ],
    {
      duration: 10000,
      iterations: Infinity
    }
    )

    cdHandle.pause();

    //Xử lý phóng to/ thu nhỏ CD
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0 ;
      cd.style.opacity = newWidth / cdWidth;
    }

    //Xử lý khi click play
    playBtn.onclick = function(){
      if(_this.isPlaying){
        audio.pause();
        
      }
      else{
        audio.play();
      }
    }

    //Khi song được play
    audio.onplay = function(){
      _this.isPlaying = true;
      player.classList.add('playing');
      cdHandle.play();
    }
    //Khi song pause
    audio.onpause = function(){
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdHandle.pause();
    }


    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function(){
    if(this.duration){
      const progressPercent = audio.currentTime / audio.duration * 100;
      progress.value = progressPercent;
    }
  }
//Xử lý khi tua song
  progress.onchange = function(e){
    if(audio.duration){
    const seekTime = (audio.duration / 100) * e.target.value
    audio.currentTime = seekTime;
    }
  }

  //Khi next bai hat
  nextBtn.onclick = function(){
    if(_this.isRandom){
      _this.playRandomSong();
    }
    else{
    _this.nextSong()
    }
    audio.play();
    _this.scrollToActiveSong();
  }

  //Khi prev bai hat
  prevBtn.onclick = function(){
    if(_this.isRandom){
      _this.playRandomSong();
    }
    else{
      _this.prevSong();
    }
    audio.play();
    _this.scrollToActiveSong();
  }

  //Khi random bai hat

  randomBtn.onclick = function(){
    _this.isRandom = !_this.isRandom;
    _this.setConfig('isRandom', _this.isRandom);
    randomBtn.classList.toggle('active', _this.isRandom);
  }
  //next khi end bai hat
  audio.onended = function(){
    if(_this.isRepeat){
      audio.play();
    }
    else {
    nextBtn.click();}
  }
  //repeat bai hat
  repeatBtn.onclick = function(){
    _this.isRepeat = !_this.isRepeat;
    _this.setConfig('isRepeat', _this.isRepeat);
    this.classList.toggle('active', _this.isRepeat);
  }

  // Lắng nghe click song
  playList.onclick = function(e){
    const songNode = e.target.closest('.song:not(.active)');
    if(songNode || e.target.closest('.option')){
      if(songNode){
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        audio.play();
        _this.render();
      }
    }
  }
  },
  loadCurrentSong : function(){
    heading.textContent = this.currentSong.name;
    cdThum.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function(){
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.render();
  },

  prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length-1;
    }
    this.loadCurrentSong();
    this.render();
  },

  playRandomSong: function(){
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    }while(newIndex === this.currentIndex)

    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.render();
  },

  loadConfig: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  scrollToActiveSong:function(){
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 200)
  },
  

  start: function(){
    //Gán cấu hình từ config vào object
    this.loadConfig();
    
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();
    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    
    // Render playlist
    this.render();
    //Hiển thị trạng thái ban đầu
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  }


};

app.start();