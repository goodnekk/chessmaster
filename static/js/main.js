var chess = (function(){

    var turnlength = 60;
    var requests = m.prop([]);
    var timer = m.prop(turnlength);
    var go = m.prop("white");
    var lastmove = m.prop("");

    function getRequests(){
        return requests;
    }

    function getTimer(){
        return timer;
    }

    function getGo(){
        return go;
    }

    function getLastMove(){
        return lastmove;
    }

    window.setInterval(function(){
        console.log("then");
        m.request({method: "GET", url: "/list"}).then(
            function(array){
                return array.sort(function(a,b){
                    if(a.count<b.count) {
                        return 1;
                    }
                    if(a.count>b.count) {
                        return -1;
                    }
                    return 0;
                })
            }
        ).then(function(array){
            if(array.length > 0){
                timer(timer()-1);
                if(timer() == 0){
                    lastmove(requests()[0].value);
                    timer(turnlength);
                    if(go()==="white"){
                        go("black");
                    } else {
                        go("white");
                    }

                    m.request({method: "GET", url: "/clear"});
                }
            }
            return array;
        }).then(requests);
    }, 1000);

    return {
        getRequests: getRequests,
        getTimer: getTimer,
        getGo: getGo,
        getLastMove: getLastMove
    };
})();


var RequestList = {
    controller: function(){
        this.requests = chess.getRequests();
        this.timer = chess.getTimer();
        this.go = chess.getGo();
        this.lastmove = chess.getLastMove();
    },
    view: function(ctrl){
        return m("div", [
            m("div", "turn: "+ctrl.go()),
            m("div", "last played move: "+ctrl.lastmove()),
            m("div", "timer: "+ctrl.timer()),
            ctrl.requests().map(function(data){
                return m("div", {class:"request"},[
                    m("span", {class:"value"}, data.value),
                    m("span", {class:"count"}, data.count)
                ]);
            })
        ]);

    }
};

m.module(document.getElementById("content"), RequestList);
