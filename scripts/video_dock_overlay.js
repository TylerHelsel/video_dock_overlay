/**
 * @typedef {Object} VideoOverlay
 * @property {string} id - A unique ID to identify the overlay.
 * @property {string} label - The text of the overlay.
 * @property {string} userId - The user's id which owns this overlay.
 * @property {string} overlayPath - File path to the overlay image
 */

//Relevant HOOK: renderCameraViews

var overlayPathMap = new Map();
overlayPathMap.set('X9ngdxbO7P5ao9Hd','overlayImages/testFrame2.png');
overlayPathMap.set('ndjCA6j9LcRaeCJ7','overlayImages/testFrame.png');

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
    }

    for (let x = 0; x < cameraList.length; x++){
        cameraList[x].id = "TEST"
    }

    /*
    for (let i = 0; i < cameraList.length; i++){
        console.log(cameraList[i].getAttribute("data-user"))
    }
    */

    //console.log(cameraList[i].children[1])
    //var testList = cameraGrid.querySelectorAll('[data-user="X9ngdxbO7P5ao9Hd"]')
    //var input = '[data-user=' + '"X9ngdxbO7P5ao9Hd"]' 
    //console.log(cameraGrid.querySelector(input))
}


``
/*
function renderOverlay(listOfPlayers){
    let p = document.createElement("img")
    p.src = "overlayImages/testFrame2.png" 
    p.style = "position: absolute;top: 0;width: 100%;height: 100%;left: 0;margin: auto;" 
    playerListLength = listOfPlayers.length;
    for (let i = 0; i < playerListLength; i++) {
        if (document.getElementsByClassName("camera-view camera-box-dock no-audio")[i] != undefined){
            if(document.getElementsByClassName("player-name noborder noanimate")[0] != undefined){
                document.getElementsByClassName("player-name noborder noanimate")[0].remove();
            }else if(document.getElementsByClassName("player-name noborder")[0] != undefined){
                document.getElementsByClassName("player-name noborder")[0].remove();
            }    
            document.getElementsByClassName("notification-bar right flexcol")[0].remove();
            document.getElementsByClassName("shadow")[0].remove();
            document.getElementsByClassName("camera-view camera-box-dock no-audio")[i].style.padding = "0" 
            document.getElementsByClassName("camera-view camera-box-dock no-audio")[i].appendChild(p)
        }else if (document.getElementsByClassName("camera-view camera-box-popout no-audio")[i] != undefined){
            if(document.getElementsByClassName("player-name noborder noanimate")[0] != undefined){
                document.getElementsByClassName("player-name noborder noanimate")[0].remove();
            }else if(document.getElementsByClassName("player-name noborder")[0] != undefined){
                document.getElementsByClassName("player-name noborder")[0].remove();
            }
            document.getElementsByClassName("notification-bar right flexcol")[0].remove();
            document.getElementsByClassName("shadow")[0].remove();
            document.getElementsByClassName("camera-view camera-box-popout no-audio")[i].style.padding = "0"
            document.getElementsByClassName("camera-view camera-box-popout no-audio")[i].appendChild(p)
        }else if (document.getElementsByClassName("camera-view camera-box-popout no video no-audio")[i] != undefined){
            if(document.getElementsByClassName("player-name noborder noanimate")[0] != undefined){
                document.getElementsByClassName("player-name noborder noanimate")[0].remove();
            }else if(document.getElementsByClassName("player-name noborder")[0] != undefined){
                document.getElementsByClassName("player-name noborder")[0].remove();
            }
            document.getElementsByClassName("notification-bar right flexcol")[0].remove();
            document.getElementsByClassName("shadow")[0].remove();
            document.getElementsByClassName("camera-view camera-box-popout no video no-audio")[i].style.padding = "0"
            document.getElementsByClassName("camera-view camera-box-popout no video no-audio")[i].appendChild(p)
        }else if (document.getElementsByClassName("camera-view camera-box-dock no video no-audio")[i] != undefined){
            if(document.getElementsByClassName("player-name noborder noanimate")[0] != undefined){
                document.getElementsByClassName("player-name noborder noanimate")[0].remove();
            }else if(document.getElementsByClassName("player-name noborder")[0] != undefined){
                document.getElementsByClassName("player-name noborder")[0].remove();
            }
            document.getElementsByClassName("notification-bar right flexcol")[0].remove();
            document.getElementsByClassName("shadow")[0].remove();
            document.getElementsByClassName("camera-view camera-box-dock no video no-audio")[i].style.padding = "0"
            document.getElementsByClassName("camera-view camera-box-dock no video no-audio")[i].appendChild(p)
        }
    }
}
*/

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
    /*
    document.getElementsByClassName("player-name noborder noanimate")[0].remove();
    document.getElementsByClassName("notification-bar right flexcol")[0].remove();
    document.getElementsByClassName("shadow")[0].remove();

    let p = document.createElement("img")
    p.src = "overlayImages/testFrame2.png" 
    p.style = "position: absolute;top: 0;width: 100%;height: 100%;left: 0;margin: auto;" 

    if (document.getElementsByClassName("camera-view camera-box-dock no-audio")[0] != undefined){
        document.getElementsByClassName("camera-view camera-box-dock no-audio")[0].style.padding = "0" 
        document.getElementsByClassName("camera-view camera-box-dock no-audio")[0].appendChild(p)
    }else if (document.getElementsByClassName("camera-view camera-box-popout no-audio")[0] != undefined){
        document.getElementsByClassName("camera-view camera-box-popout no-audio")[0].style.padding = "0"
        document.getElementsByClassName("camera-view camera-box-popout no-audio")[0].appendChild(p)
    } 
    */   
  })

//Hooks.on('pf2e.systemReady', (playerList, html) => {
//    listOfPlayers = Array.from(game.users.keys())
//})

 