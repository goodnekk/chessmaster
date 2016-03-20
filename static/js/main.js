var chess = (function(){

    var turnlength = 5;
    var requests = m.prop([]);
    var timer = m.prop(turnlength);
    var go = m.prop("White");
    var lastmoves = m.prop([]);

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
        return lastmoves;
    }

    window.setInterval(function(){
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
                });
            }
        ).then(function(array){
            if(array.length > 0){
                timer(timer()-1);
                if(timer() == 0){
                    console.log("hello?");
                    lastmoves([go()+": "+requests()[0].value].concat(lastmoves()));   
                    timer(turnlength);
                    if(go()==="White"){
                        go("Black");
                    } else {
                        go("White");
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
        this.lastmoves = chess.getLastMove();
    },
    view: function(ctrl){
        return m("div", [
            m("h4", "turn: "+ctrl.go()),
            m("div", (ctrl.timer()<60) ? "next move in: "+ctrl.timer() : "waiting for votes"),

            m("h2", "Last moves: "),
            m("div", ctrl.lastmoves().map(function(move){
                return m("div", {class:"request"}, m("span", {class:"value"}, move));
            })),

            m("h2", "Current move: "),

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
