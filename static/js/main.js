var chess = (function(){

    var turnlength = 60;
    var requests = m.prop([]);
    var timer = m.prop(turnlength);
    var go = m.prop("Wit");
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
                    lastmoves([go()+": "+requests()[0].value].concat(lastmoves()));
                    timer(turnlength);
                    if(go()==="Wit"){
                        go("Zwart");
                    } else {
                        go("Wit");
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
            m("h4", "zet: "+ctrl.go()),
            m("div", (ctrl.timer()<60) ? "volgende zet in: "+ctrl.timer() : "stuur jouw zet!"),

            m("h2", "Laatste zetten: "),
            m("div", ctrl.lastmoves().map(function(move){
                return m("div", {class:"request"}, m("span", {class:"value"}, move));
            })),

            m("h2", "Huidige zet: "),

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
