/**
 * @typedef {Object} VideoOverlay
 * @property {string} id - A unique ID to identify the overlay.
 * @property {string} label - The text of the overlay.
 * @property {string} userId - The user's id which owns this overlay.
 * @property {string} overlayPath - File path to the overlay image
 */

//Relevant HOOK: renderCameraViews

var overlayPathMap = new Map();
//Knoth
overlayPathMap.set('NFQMwQX34Hics750','overlayImages/Knoth.png');
//Sera
overlayPathMap.set('El9jXCuYQTHBld0A','overlayImages/Seraphina.png');
//Quofire
overlayPathMap.set('6qTV7EyAAvg9xC1C','overlayImages/Quofire.png');
//Roscoe
overlayPathMap.set('1gmDxquStNadlnxX','overlayImages/Roscoe.png');
//Ryfinii
overlayPathMap.set('1sNf9dQE43swHYtn','overlayImages/Ryfinii.png');
//Lindy
overlayPathMap.set('39aWYLAlEFvZAWrl','overlayImages/Lindy.png');
//GM
overlayPathMap.set('Ez4DQ6WuWb7af6kM','overlayImages/Gamemaster.png');

function renderOverlay(cameraList){
    var usersArray = Array.from(game.users)

    for (let i = 0; i < cameraList.length; i++){
        var userId = usersArray[i]._id
        var userQuerySearch = '[data-user=' + '"' + userId + '"]'
        var currentElement = cameraList[i]
        var currentElementUser = currentElement.getAttribute("data-user")
        var overlayPath = overlayPathMap.get(userId)
        console.log("Generated Data => userId: " + userId + ", currentElementUser: " + currentElementUser + ", overlayPath: " + overlayPath);
        let imageOverlay = document.createElement("img")
        imageOverlay.src = overlayPath
        imageOverlay.style = "position: absolute;top: 0;width: 100%;height: 100%;left: 0;margin: auto;"

        //build the overlay
        currentElement.appendChild(imageOverlay)
        //currentElement.getElementsByClassName("player-name noborder noanimate")[0].remove();
        //currentElement.getElementsByClassName("camera-view camera-box-dock no-audio")[0].style.padding = "0" 
        //currentElement.getElementsByClassName("notification-bar right flexcol")[0].remove();
        //currentElement.getElementsByClassName("shadow")[0].remove();
    }

    for (let x = 0; x < cameraList.length; x++){
        cameraList[x].id = "TEST"
    }
}

class VideoOverlay {
    //This must match the name in module.json
    static ID = 'video_dock_overlay';

    static FLAGS = {
        OVERLAYS: 'overlays'
    }

    static TEMPLATES = {
        OVERLAYS: 'modules/${this.ID}/templates/video_dock_overlays.hbs'
    }
}

class videoOverlayData{
    
    static get allOverlays() {

        const allOverlays = game.users.reduce((accumulator, user) => {
            const userOverlays = this.getOverlayForUser(user.id);

            return {
                ...accumulator,
                ...userOverlays
            }
        }, {});

        return allOverlays;
    }

    static getOverlayForUser(userId){
        return game.users.get(userId)?.getFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS)
    }

    static createOverlay(userId, overlayData) {

        const newOverlay = {
            isDone: false,
            ...overlayData,
            id: foundry.utils.randomID(16),
            userId,
        }

        const newOverlays = {
            [newOverlay.id]: newOverlay
        }

        return game.users.get(userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, newOverlays)
    }
    
    static updateOverlay(overlayID, updateData) {

        const relevantOverlay = this.allOverlays[overlayID];
        console.log(relevantOverlay)

        //construct update to send
        const update = {
            [overlayID]: updateData
        }

        return game.users.get(relevantOverlay.userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, update);
    }
    
    //Will update multiple overlays as long as they are on the same user
    static updateOverlays(userId, updateData) {
        return game.users.get(userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS, updateData)
    }

    static deleteOverlay(overlayID) {

        const relevantOverlay = this.allOverlays[overlayID]

        const keyDeletion = {
            [`-=${overlayID}`]: null
        }

        return game.users.get(relevantOverlay.userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, keyDeletion)

    }

    setUpOverlay(){
        document.getElementsByClassName("player-name noborder noanimate")[0].remove();
        document.getElementsByClassName("camera-view camera-box-dock no-audio")[0].style.padding = "0" 
        document.getElementsByClassName("notification-bar right flexcol")[0].remove();
        document.getElementsByClassName("shadow")[0].remove();
    
        let p = document.createElement("img")
        p.src = "overlayImages/testFrame2.png" 
        p.style = "position: absolute;top: 0;width: 100%;height: 100%;left: 0;margin: auto;" 
        document.getElementsByClassName("camera-view camera-box-dock no-audio")[0].appendChild(p)
    };
}

Hooks.on('renderCameraViews', (playerList, html) => {
    var cameraGrid = document.getElementsByClassName("camera-grid")[0]
    var cameraList = cameraGrid.children
    renderOverlay(cameraList);
  })


 