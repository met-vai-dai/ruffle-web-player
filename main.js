if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
};

class App extends EventTarget {
    constructor() {
        super();
        this.isPlay = false;
        this.onFileLoadEvent = new Event("onFileLoad");

        screen.orientation.addEventListener('change', (function (e) {
            if (this.player.metadata != null) {
                let scrOrientation = e.target;
                if (scrOrientation.type.indexOf("portrait") != -1) {
                    this.player.exitFullscreen();
                    this.wakeLocking(true);
                } else {
                    this.player.enterFullscreen();
                    this.wakeLocking(true);
                }
            }
        }).bind(this));
    }

    setPlayer(playerObj) {
        this.player = playerObj;
    }

    async wakeLocking(pIsLock) {
        this.isLock = false || pIsLock;
        if (this.isLock) {
            if (this.wakeLock == undefined) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                this.wakeLock.addEventListener("release", function () {
                    this.wakeLock = undefined;
                });
            }
        } else {
            if (this.wakeLock) {
                this.wakeLock.release();
                this.wakeLock = undefined;
            }
        }
    }

    async loadFile(file) {
        let buf = await new Response(file).arrayBuffer();
        this.player.load({ data: buf });
        this.file = file
        // document.querySelector("#caption").innerHTML = file.name;
        this.wakeLocking(true);
        this.isPlay = true;
        this.dispatchEvent(this.onFileLoadEvent);
    }

    async reload() {
        await this.loadFile(this.file);
    }

    fullscreen() {
        if (this.player.metadata != null) {
            if (!this.player.isFullscreen) {
                this.player.enterFullscreen();
                wakeLocking(true);
            } else {
                this.player.exitFullscreen();
                wakeLocking(true);
            }
        }
    }

    play() {
        if (this.player.metadata) {
            this.player.play();
            this.isPlay = true;
            this.wakeLocking(true);
        }
    }

    pause() {
        if (this.player.metadata) {
            this.player.pause();
            this.isPlay = false;
            this.wakeLocking(false);
        }
    }
}

window.app = new App();

window.addEventListener("load", function (e) {
    const ruffle = window.RufflePlayer.newest();
    window.player = ruffle.createPlayer();
    let container = document.getElementById("main-container");
    window.player.className = "bg-dark bg-gradient";
    container.appendChild(player);
    window.app.setPlayer(window.player);

    window.player.addEventListener("loadedmetadata", function (e) {
        let w = e.target.metadata.width;
        let h = e.target.metadata.height;
        let res = Math.round((100 - ((w - h) / w * 100)) * 10) / 10;
        player.style.height = `${res}vmin`;
    });
});

window.app.addEventListener("onFileLoad", (e) => {
    document.querySelector("#caption").innerHTML = e.target.file.name;
});

window.fileTable = document.querySelector("#t-file");
window.fileTable.addEventListener("onActive", function (e) {
    let index = e.target.activeIndex;
    if (index >= 0) {
        window.app.loadFile(e.target.files[index]);
    }
});
